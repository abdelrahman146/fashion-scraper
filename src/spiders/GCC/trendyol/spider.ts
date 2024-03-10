// Import necessary libraries
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { PrismaClient } from "@prisma/client";

import { Browser, Page } from "puppeteer";
import { categorize } from "../../../core/transformers/findCategory.transformer";
import { findGender } from "../../../core/transformers/findGender.transformer";
import { REGION } from "../../../core/types";
import { findColor } from "../../../core/transformers/findColor.transformer";
import { findMaterial } from "../../../core/transformers/findMaterial.transformer";
import { log } from "../../../core/log";
import { getRandomInteger } from "../../../core/utils/number.utils";
import moment from "moment";

puppeteer.use(stealthPlugin());
const prisma = new PrismaClient();

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

type Data = {
  id: string | null;
  title: string | null;
  brand: string | null;
  ratingCount: string | null;
  ratingScore: string | null;
  price: {
    price: string | null;
    priceBeforeDiscount: string | null;
  };
  url: string | null;
  hasPromotion: boolean | null;
};

type SpiderOptions = {
  max?: number;
  batch?: number;
  defaultGender?: string;
  region?: REGION;
  url: string;
  source?: string;
  defaultCurrency?: string;
  timeoutBuffer?: [number, number];
  defaultCategory?: string;
};

export async function spider({
  batch = 100,
  max = 5000,
  defaultCurrency = "AED",
  defaultGender,
  region = REGION.GCC,
  timeoutBuffer = [15_000, 30_000],
  source = "trendyol",
  defaultCategory,
  url,
}: SpiderOptions) {
  let current = 0;
  const maxTries = 5;
  const browser: Browser = await puppeteer.launch({ headless: "new" });
  const page: Page = await browser.newPage();
  const alreadyScraped = await checkIfScraped(url);
  if (alreadyScraped) return -1;
  await page.goto(url, { waitUntil: "networkidle0" });

  let data: Data[] = [];
  let tries = 0;
  async function scrapeData(): Promise<boolean> {
    const newData: Data[] = await page.evaluate((current) => {
      const products = Array.from(document.querySelectorAll(".product"));

      /**
       * Extractors START
       */
      function extractId(product: Element): string | null {
        return product.getAttribute("data-contentid") || null;
      }

      function extractUrl(product: Element): string | null {
        const anchor = product.querySelector("[data-testid='product-url']") as HTMLAnchorElement;
        return anchor.href || null;
      }

      function extractTitle(product: Element): string | null {
        return product.querySelector(".name")?.textContent?.trim().replace(/,/gm, "") || null;
      }

      function extractBrand(product: Element): string | null {
        return product.querySelector(".brand")?.textContent?.trim() || null;
      }

      function extractPrice(product: Element): { priceBeforeDiscount: string | null; price: string | null } {
        let suggestedPrice = product.querySelector(".p-suggested-price")?.textContent?.trim().replace(/\D/g, "");
        let sellingPrice = product.querySelector(".p-selling-price")?.textContent?.trim().replace(/\D/g, "");
        if (suggestedPrice && sellingPrice) {
          return { price: sellingPrice, priceBeforeDiscount: suggestedPrice };
        }
        if (sellingPrice && !suggestedPrice) {
          return { price: sellingPrice, priceBeforeDiscount: null };
        }

        sellingPrice = product.querySelector("p.selling-price.with-discount")?.textContent?.trim().replace(/\D/g, "");
        suggestedPrice = product.querySelector(".price-text.stroked")?.textContent?.trim().replace(/\D/g, "");
        if (sellingPrice && suggestedPrice) {
          return { price: sellingPrice, priceBeforeDiscount: suggestedPrice };
        }

        sellingPrice = product.querySelector(".selling-price")?.textContent?.trim().replace(/\D/g, "");

        if (sellingPrice) {
          return { price: sellingPrice, priceBeforeDiscount: null };
        }

        return { price: null, priceBeforeDiscount: null };
      }

      function extractRatingCount(product: Element): string | null {
        const el = product.querySelector(".p-total-rating-count")?.textContent?.match(/\d+/);
        if (!el) return null;
        return el[0] || null;
      }

      function extractRatingScore(product: Element): string | null {
        const ratingElement = product.querySelector(".rating-score") as HTMLDivElement;

        if (ratingElement) {
          const ratingStarsElement = ratingElement.querySelector(".p-rating-full") as HTMLDivElement;
          if (ratingStarsElement) {
            const percentageFilled = parseFloat(ratingStarsElement.style.width);
            const ratingOutOf100 = (percentageFilled / 100) * 100;

            return ratingOutOf100.toFixed(2);
          } else {
            return null;
          }
        } else {
          return null;
        }
      }

      function extractHasPromotion(product: Element): boolean | null {
        const promoEl = product.querySelector(".promotions");
        if (promoEl) {
          return true;
        }
        return false;
      }

      /**
       * Extractors END
       */

      const uniqueProducts = products.slice(current);

      return uniqueProducts.map((product: Element) => {
        try {
          const id = extractId(product);
          const title = extractTitle(product);
          const brand = extractBrand(product);
          const ratingCount = extractRatingCount(product);
          const ratingScore = extractRatingScore(product);
          const price = extractPrice(product);
          const url = extractUrl(product) || "";
          const hasPromotion = extractHasPromotion(product);

          return { id, title, brand, ratingCount, ratingScore, price, url, hasPromotion };
        } catch {
          return {
            id: null,
            title: null,
            brand: null,
            ratingCount: null,
            ratingScore: null,
            price: { price: null, priceBeforeDiscount: null },
            url: null,
            hasPromotion: null,
          };
        }
      });
    }, current);
    if (newData.length === 0) {
      tries++;

      if (tries <= maxTries) {
        log(`🕷️  [TRENDYOL_SPIDER] ❗ Failed to load more products (number of tries: ` + tries + "/" + maxTries + ")");
        return true;
      } else {
        log(`🕷️  [TRENDYOL_SPIDER] ⛔ Maximum tries reached aborting...`);
        return false;
      }
    } else {
      tries = 0;
      data = data.concat(newData);

      log("🕷️  [TRENDYOL_SPIDER] 🕸️  Scraped", data.length + current, "products"); // Log the number of items scraped

      return current <= max; // Continue scraping until you reach max
    }
  }

  async function unload() {
    let i = current + 1;
    for (const item of data) {
      try {
        if (!item.title || !item.price.price) continue;
        const { category, subCategory } = categorize(item.title, defaultCategory);
        const gender = findGender(item.title, defaultGender as "female" | "male" | "unisex");
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
          sellingPrice: Number(item.price.price) / 100,
          region,
          title: item.title,
          url: item.url,
          brand: item.brand,
          ratingCount: Number(item.ratingCount),
          hasPromotion: item.hasPromotion,
          priceBeforeDiscount: Number(item.price.priceBeforeDiscount) / 100,
          pageOrder: i++,
          currency: defaultCurrency,
          ratingScore: item.ratingScore,
          color: findColor(item.title),
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
    current += data.length;
    data = [];
  }

  // Scroll and scrape until you reach 1000 items
  while (await scrapeData()) {
    if (current >= max) break;
    if (data.length >= batch) {
      log(`🕷️  [TRENDYOL_SPIDER] 📂 Unloading batch`);
      await unload();
      log(`🕷️  [TRENDYOL_SPIDER] 📁 Succesffully finished unloading`);
    }
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    const timeout = getRandomInteger(timeoutBuffer[0], timeoutBuffer[1]) * (tries + 1);
    log(`🕷️  [TRENDYOL_SPIDER] ⏳ Buffering for ${moment.duration(timeout).humanize()} ...`);
    // Wait for new content to load, adjust the wait time according to your needs
    await new Promise((r) => setTimeout(r, timeout));
  }

  if (data.length > 0) {
    log(`🕷️  [TRENDYOL_SPIDER] 📂 Unloading last batch`);
    await unload();
    log(`🕷️  [TRENDYOL_SPIDER] 📁 Succesffully finished unloading`);
  }

  // Close the browser
  await browser.close();
  await registerAsScraped(url);
  return current;
}
