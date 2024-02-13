// Import necessary libraries
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { PrismaClient } from "@prisma/client";

import { Browser, Page } from "puppeteer";
import { categorize } from "../../../core/categorize";
import { REGION } from "../../../core/types";
import { findMaterial } from "../../../core/findMaterial";
import { log, logr } from "../../../core/log";
import { getRandomInteger } from "../../../core/number.utils";
import moment from "moment";

puppeteer.use(stealthPlugin());
const prisma = new PrismaClient();

type Data = {
  id: string | null;
  title: string | null;
  brand: string | null;
  price: {
    price: string | null;
    priceBeforeDiscount: string | null;
  };
  url: string | null;
  hasPromotion: boolean | null;
};

type SpiderOptions = {
  defaultGender: string;
  region?: REGION;
  url: string;
  defaultColor: string;
  source?: string;
  defaultCurrency?: string;
  defaultCategory?: string;
};

async function navigateWithRetry(page: Page, url: string, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await page.goto(url, { waitUntil: "networkidle0" });
      // If navigation succeeds, return
      return true;
    } catch (error) {
      log(`🕷️  [6THSTREET_SPIDER] ❗ Navigation attempt ${retries + 1} failed with timeout error. Retrying...`);
      retries++;
      await new Promise((r) => setTimeout(r, getRandomInteger(15000, 30000)));
    }
  }
  logr(`🕷️  [6THSTREET_SPIDER] ⛔ Navigation failed after ${maxRetries} attempts. for ${url}`);
  return false;
}

async function launchWithRetry(url: string, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const browser: Browser = await puppeteer.launch({ headless: "new" });
      // If navigation succeeds, return
      return browser;
    } catch (error) {
      log(`🕷️  [6THSTREET_SPIDER] ❗ Launch attempt ${retries + 1} failed with protocol timeout error. Retrying...`);
      retries++;
      await new Promise((r) => setTimeout(r, getRandomInteger(15000, 30000)));
    }
  }
  logr(`🕷️  [6THSTREET_SPIDER] ⛔ Launch failed after ${maxRetries} attempts. for ${url}`);
  return null;
}

export async function spider({
  defaultCurrency = "AED",
  defaultGender,
  region = REGION.GCC,
  source = "6thstreet",
  defaultCategory,
  defaultColor,
  url,
}: SpiderOptions): Promise<number> {
  async function checkIfScraped(url: string): Promise<boolean> {
    const scraped_url = await prisma.scraped.findFirst({
      where: {
        url,
      },
    });
    return !!scraped_url;
  }
  async function registerAsScraped(url: string) {
    await prisma.scraped.create({
      data: {
        url,
      },
    });
  }

  async function getTotalProducts(): Promise<number> {
    return page.evaluate(() => {
      const el = document.querySelector(".Product-Loaded-Info");
      if (el) {
        return Number(el.textContent?.split(" ").filter((i) => Number(i))[1]);
      } else {
        return document.querySelectorAll("li.ProductItem").length;
      }
    });
  }

  async function extract(): Promise<Element[]> {
    return page.evaluate((totalScraped) => {
      const products = Array.from(document.querySelectorAll("li.ProductItem"));
      return products.slice(totalScraped);
    }, totalScraped);
  }

  function transform(products: Element[]): Data[] {
    /**
     * Extractors START
     */
    function extractId(product: Element): string | null {
      let id = product.id;
      return id;
    }

    function extractUrl(product: Element): string | null {
      const anchor = product.querySelector("a");
      return anchor ? anchor.getAttribute("href") : null;
    }

    function extractTitle(product: Element): string | null {
      return product.querySelector("p.ProductItem-Title")?.textContent?.trim() || null;
    }

    function extractBrand(product: Element): string | null {
      return product.querySelector("h2.ProductItem-Brand")?.textContent?.trim() || null;
    }

    function extractPrice(product: Element): { priceBeforeDiscount: string | null; price: string | null } {
      let sellingPrice = product.querySelector("span.Price-Special")?.textContent?.trim().replace(/\D/g, "");
      let priceBeforeDiscount = product.querySelector(".Price-Del")?.textContent?.trim().replace(/\D/g, "");
      if (!sellingPrice) {
        sellingPrice = product.querySelector(".Price")?.textContent?.trim().replace(/\D/g, "");
      }
      return { price: sellingPrice || null, priceBeforeDiscount: priceBeforeDiscount || null };
    }

    function extractHasPromotion(product: Element): boolean | null {
      let priceBeforeDiscount = product.querySelector(".Price-Del")?.textContent?.trim().replace(/\D/g, "");
      if (priceBeforeDiscount) {
        return true;
      }
      return false;
    }
    /**
     * Extractors END
     */
    return products.map((product: Element) => {
      try {
        const id = extractId(product);
        const title = extractTitle(product);
        const brand = extractBrand(product);
        const price = extractPrice(product);
        const url = extractUrl(product) || "";
        const hasPromotion = extractHasPromotion(product);
        return { id, title, brand, price, url, hasPromotion };
      } catch {
        return {
          id: null,
          title: null,
          brand: null,
          price: { price: null, priceBeforeDiscount: null },
          url: null,
          hasPromotion: null,
        };
      }
    });
  }

  async function load(totalScraped: number, data: Data[]) {
    let order = totalScraped + 1;
    for (const item of data) {
      try {
        if (!item.id || !item.title || !item.price.price) continue;
        const { category, subCategory } = categorize(item.title, defaultCategory);
        const gender = defaultGender;
        /**
         * if exists update only
         */
        const product = await prisma.product.findFirst({
          where: {
            psId: item.id,
          },
        });
        const data = {
          psId: item.id,
          category,
          subCategory,
          source,
          gender,
          sellingPrice: Number(item.price.price),
          region,
          title: item.title,
          url: item.url,
          brand: item.brand,
          hasPromotion: item.hasPromotion,
          priceBeforeDiscount: Number(item.price.priceBeforeDiscount),
          pageOrder: order++,
          currency: defaultCurrency,
          color: defaultColor,
          material: findMaterial(item.title),
        };
        if (product) {
          await prisma.product.update({
            where: {
              id: product.id,
            },
            data,
          });
        } else {
          await prisma.product.create({
            data,
          });
        }
      } catch {
        continue;
      }
    }
  }

  function calculateTimeEstimate(totalProducts: number): number {
    const loadTime = [...Array(totalProducts + 1).keys()].reduce((tot, curr) => {
      const timeout = getRandomInteger(1000, 5000) * curr * 0.5;
      return tot + timeout;
    }, 0);
    const pauseTime = [...Array(totalProducts + 1).keys()].reduce((tot, curr) => {
      const timeout = getRandomInteger(1000, 4000);
      return tot + timeout;
    }, 0);
    return loadTime + pauseTime;
  }

  const browser: Browser | null = await launchWithRetry(url);
  if (!browser) return -3;
  const page: Page = await browser.newPage();
  let success = await navigateWithRetry(page, url);
  if (!success) return -3;

  const alreadyScraped = await checkIfScraped(url);
  if (alreadyScraped) return -1;

  let count = 1;
  let totalScraped = 0;
  const totalProducts = await getTotalProducts();

  log("📊 Total Products: ", totalProducts, "Estimated Time to finish: ", moment.duration(calculateTimeEstimate(totalProducts)).humanize(true));

  while (true) {
    let timeout = getRandomInteger(1000, 3000);
    log(`🕷️  [6THSTREET_SPIDER] ⏳ Warming up for ${moment.duration(timeout).humanize()} ...`);
    await new Promise((r) => setTimeout(r, timeout));
    log(`🕷️  [6THSTREET_SPIDER] ⏩ Resuming ...`);

    const loadButton = document.querySelector(".LoadMore > button") as HTMLButtonElement;
    if (loadButton && !loadButton.disabled) {
      loadButton.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      timeout = getRandomInteger(1000, 3000);
      await new Promise((r) => setTimeout(r, timeout));
      loadButton.click();
      timeout = getRandomInteger(1000, 5000) * count * 0.5;
      log(`🕷️  [6THSTREET_SPIDER] ⏳ Loading data, waiting for ${moment.duration(timeout).humanize()} ...`);
      await new Promise((r) => setTimeout(r, timeout));
      log(`🕷️  [6THSTREET_SPIDER] ⏩ Resuming ...`);
      const scraped = await extract();
      const data = transform(scraped);
      log(`🕷️  [6THSTREET_SPIDER] 🟩 Scraped ${data.length}%. total scraped: ${totalScraped} / ${totalProducts}`);
      await load(totalScraped, data);
    } else {
      break;
    }

    timeout = getRandomInteger(1000, 5000);
    log(`🕷️  [6THSTREET_SPIDER] ⏳ Pausing for ${moment.duration(timeout).humanize()} ...`);
    await new Promise((r) => setTimeout(r, timeout));
    log(`🕷️  [6THSTREET_SPIDER] ⏩ Resuming ...`);
    const scroll = getRandomInteger(300, 700);
    window.scrollBy({ top: -scroll, behavior: "smooth" });
  }

  await registerAsScraped(url);

  // Close the browser
  await browser.close();
  return totalScraped;
}
