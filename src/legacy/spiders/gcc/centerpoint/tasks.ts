import { Page } from "puppeteer";
import { Data } from "../../../core/Spider";
import { promiseWithRetry } from "../../../core/utils/common.utils";

async function extractProducts(page: Page): Promise<Data[] | -1> {
  return promiseWithRetry(() => {
    return page.evaluate(() => {
      /**
       * Extractors START
       */
      function extractId(product: Element): string | undefined {
        let id = product.getAttribute("data-id") || undefined;
        return id;
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
        return product.querySelector("a.title")?.textContent?.trim();
      }

      function extractBrand(product: Element): string | undefined {
        return product.querySelector("span.title")?.textContent?.trim();
      }

      function extractPrice(product: Element): { priceBeforeDiscount?: number; currency: string; sellingPrice: number } {
        let sellingPrice = product.querySelector(".is-price")?.textContent?.trim().replace(/\D/g, "");
        let priceBeforeDiscount = product.querySelector(".was-price")?.textContent?.trim().replace(/\D/g, "");
        let currency = product.querySelector('span[itemprop="priceCurrency"]')?.getAttribute("content")?.toUpperCase() || "AED";

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

      const products = Array.from(document.querySelectorAll("li.product-item"));

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
    });
  }, {});
}

async function getLastPage(page: Page): Promise<number> {
  return page.evaluate(() => {
    const p = document.querySelector(".lms-pagination > ul")?.children as HTMLDivElement[] | undefined;
    if (p && p.length > 0) {
      return Number(p[p.length - 2].innerText);
    } else {
      return 1;
    }
  });
}

const getGender = (url: string) => {
  if (url.includes("cpmen")) return "men";
  if (url.includes("cpwomen")) return "women";
  if (url.includes("boys")) return "boys";
  if (url.includes("girls")) return "girls";
  return "unisex";
};

export default { extractProducts, getLastPage, getGender };
