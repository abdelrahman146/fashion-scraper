// Import necessary libraries
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { PrismaClient } from "@prisma/client";

import { Browser, Page } from "puppeteer";
import { categorize } from "../../../core/transformers/findCategory.transformer";
import { REGION } from "../../../core/types";
import { findMaterial } from "../../../core/transformers/findMaterial.transformer";
import { log, logr } from "../../../core/log";
import { getRandomInteger } from "../../../core/utils/number.utils";
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
      log(`🕷️  [MAX_SPIDER] ❗ Navigation attempt ${retries + 1} failed with timeout error. Retrying...`);
      retries++;
      await new Promise((r) => setTimeout(r, getRandomInteger(15000, 30000)));
    }
  }
  logr(`🕷️  [MAX_SPIDER] ⛔ Navigation failed after ${maxRetries} attempts. for ${url}`);
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
      log(`🕷️  [MAX_SPIDER] ❗ Launch attempt ${retries + 1} failed with protocol timeout error. Retrying...`);
      retries++;
      await new Promise((r) => setTimeout(r, getRandomInteger(15000, 30000)));
    }
  }
  logr(`🕷️  [MAX_SPIDER] ⛔ Launch failed after ${maxRetries} attempts. for ${url}`);
  return null;
}

export async function spider({
  defaultCurrency = "AED",
  defaultGender,
  region = REGION.GCC,
  source = "max",
  defaultCategory,
  defaultColor,
  url,
}: SpiderOptions): Promise<number> {
  const timeoutBuffer = [15_000, 30_000];
  const browser: Browser | null = await launchWithRetry(url);
  if (!browser) return -3;
  const page: Page = await browser.newPage();

  let total = 0;
  let success = await navigateWithRetry(page, url);
  if (!success) return -3;

  async function getLastPage(): Promise<number> {
    return page.evaluate(() => {
      const totalArr = document.querySelector("#category-loadmore-layout")?.textContent?.split(" products out of ");
      if (totalArr && totalArr.length > 0) {
        return Math.floor(Number(totalArr[1].replace(/\D/gm, "")) / 48);
      } else {
        return 1;
      }
    });
  }

  async function checkIfScraped(url: string): Promise<boolean> {
    const scraped_url = await prisma.scraped.findFirst({
      where: {
        url,
      },
    });
    return !!scraped_url;
  }

  async function scrapeData(): Promise<Data[]> {
    return page.evaluate(() => {
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
        return product.querySelector("a")?.getAttribute("aria-label")?.trim() || null;
      }

      function extractBrand(product: Element): string | null {
        return "Max";
      }

      function extractPrice(product: Element): { priceBeforeDiscount: string | null; price: string | null } {
        const price = product.children
          ? Array.from(product.children)[1]
              .textContent?.split("AED ")
              .filter((val: any) => val)
          : null;
        if (price) {
          return { price: price[0] || null, priceBeforeDiscount: price[1] || null };
        }
        return { price: null, priceBeforeDiscount: null };
      }

      function extractHasPromotion(product: Element): boolean | null {
        let sale = product.querySelector(".red-sale");
        if (sale) {
          return true;
        }
        return false;
      }
      /**
       * Extractors END
       */
      const products = Array.from(document.querySelectorAll(".product"));
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
    });
  }

  async function unload(currentPage: number, data: Data[]) {
    let i = 42 * (currentPage - 1);
    for (const item of data) {
      const order = ++i;
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
          pageOrder: order,
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

  async function registerAsScraped(url: string) {
    await prisma.scraped.create({
      data: {
        url,
      },
    });
  }

  const lastPage = await getLastPage();
  log(
    "📊 Total Pages: ",
    lastPage + 1,
    "Estimated Total Products",
    (lastPage + 1) * 48,
    "estimated finish  ",
    moment.duration(32000 * (lastPage + 1)).humanize(true)
  );
  for (let i = 0; i <= lastPage; i++) {
    const url_paginated = i > 0 ? url + "&p=" + i : url;
    const alreadyScraped = await checkIfScraped(url_paginated);
    if (alreadyScraped) continue;
    if (i > 1) {
      const success = await navigateWithRetry(page, url_paginated);
      if (!success) continue;
    }
    const data = await scrapeData();
    await unload(i + 1, data);
    total += data.length;
    await registerAsScraped(url_paginated);

    // Showing Percentage of completion
    const percentage = Math.round(((i + 1) / lastPage) * 100);
    if (percentage % 10 === 0 || percentage === 99) {
      log(`🕷️  [MAX_SPIDER] 🟩 Completed ${percentage}% of total products`);
    }

    // Wait for new content to load, adjust the wait time according to your needs
    const timeout = getRandomInteger(timeoutBuffer[0], timeoutBuffer[1]);
    log(`🕷️  [MAX_SPIDER] ⏳ Pausing for ${moment.duration(timeout).humanize()} ...`);
    await new Promise((r) => setTimeout(r, timeout));
    log(`🕷️  [MAX_SPIDER] ⏩ Resuming ...`);
  }

  // Close the browser
  await browser.close();
  return total;
}
