import { Page } from "puppeteer";
import { Data } from "../../../core/Spider";
import { getRandomInteger } from "../../../core/utils/number.utils";
import { evaluateWithRetry } from "../../../core/utils/puppeteer.utils";

/**
 * Extracts product data from a web page.
 *
 * @param page - The page to extract data from.
 * @param totalScraped - The total number of products already scraped.
 * @returns A promise that resolves to an array of product data.
 */
async function extractProducts(page: Page, totalScraped: number): Promise<Data[] | -1> {
  return evaluateWithRetry(
    page,
    () => {
      /**
       * Extractors START
       */
      function extractId(product: Element): string | undefined {
        let url = product.querySelector("a")?.getAttribute("href");
        if (url) {
          url = url.trim().replace(/\/$/, "");
          const parts = url.split("/");
          return parts[parts.length - 3] + "/" + parts[parts.length - 2];
        }
      }

      function extractImg(product: Element): string | undefined {
        let src = product.querySelector("img")?.src;
        return src;
      }

      function extractUrl(product: Element): string | undefined {
        const href = product.querySelector("a")?.getAttribute("href");
        return href ? href : undefined;
      }

      function extractTitle(product: Element): string | undefined {
        return product.querySelector(".product_title")?.textContent?.trim();
      }

      function extractBrand(product: Element): string | undefined {
        return product.querySelector(".pdp_brand")?.textContent?.trim();
      }

      function extractPrice(product: Element): { priceBeforeDiscount?: number; currency: string; sellingPrice: number } {
        let sellingPrice = product.querySelector(".price")?.textContent?.trim().replace(/\D/g, "");
        let currency =
          product
            .querySelector(".price")
            ?.textContent?.trim()
            .replace(/[^A-Z]/g, "") || "AED";
        let priceBeforeDiscount = product.querySelector(".old_price")?.textContent?.trim().replace(/\D/g, "");
        return { sellingPrice: Number(sellingPrice), currency, priceBeforeDiscount: Number(priceBeforeDiscount) };
      }

      function extractHasPromotion(product: Element): boolean | undefined {
        let priceBeforeDiscount = product.querySelector(".was-price")?.textContent?.trim().replace(/\D/g, "");
        if (priceBeforeDiscount) {
          return true;
        }
        return false;
      }
      /**
       * Extractors END
       */

      const products = Array.from(document.querySelectorAll("ul.product_listing_wrap > li"));

      return products.reduce((acc: Data[], product: Element) => {
        try {
          const pid = extractId(product);
          if (!pid) return acc;
          const title = extractTitle(product);
          if (!title) return acc;
          const image = extractImg(product);
          if (!image) return acc;
          const brand = extractBrand(product);
          if (!brand) return acc;
          const price = extractPrice(product);
          if (!price.sellingPrice) return acc;
          const url = extractUrl(product) || "";
          if (!url) return acc;
          const hasPromotion = extractHasPromotion(product);
          if (hasPromotion === undefined) return acc;
          return [...acc, { pid, title, image, brand, price, url, hasPromotion }];
        } catch {
          return acc;
        }
      }, []);
    },
    []
  );
}

async function getLastPage(page: Page): Promise<number | -1> {
  return evaluateWithRetry(
    page,
    () => {
      const p = document.querySelectorAll("ul.pagination > li");
      if (p && p.length > 0) {
        return Number(p[p.length - 2].textContent?.replace(/\D/gm, "").trim());
      } else {
        return 1;
      }
    },
    []
  );
}

async function checkIfArabic(page: Page): Promise<boolean | -1> {
  return evaluateWithRetry(
    page,
    () => {
      const text = document.querySelector("h1.product_title")?.textContent;
      if (text && text.length > 0) {
        const matches = text.match(/[^\x00-\x7F]/g);
        const nonAsciiCount = matches ? matches.length : 0;
        return nonAsciiCount / text.length > 0.2;
      } else {
        return true;
      }
    },
    []
  );
}

function containsSignificantNonAscii(text: string) {
  const matches = text.match(/[^\x00-\x7F]/g);
  const nonAsciiCount = matches ? matches.length : 0;
  return nonAsciiCount / text.length > 0.2;
}

const getGender = (url: string) => {
  if (url.includes("men")) return "men";
  if (url.includes("women")) return "women";
  if (url.includes("kids/boys")) return "boys";
  if (url.includes("kids/girls")) return "girls";
  return "unisex";
};

const getCategory = (url: string) => {
  if (url.includes("footwear") || url.includes("shoes")) return "footwear";
  if (url.includes("bags")) return "bag";
};

export default { extractProducts, getCategory, getGender, getLastPage, checkIfArabic, containsSignificantNonAscii };
