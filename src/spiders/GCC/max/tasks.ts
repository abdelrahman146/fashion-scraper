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
        let id = product.id;
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
        return product.querySelector("a")?.getAttribute("aria-label")?.trim();
      }

      function extractBrand(product: Element): string | undefined {
        return "Max";
      }

      function extractPrice(product: Element): { priceBeforeDiscount?: number; currency: string; sellingPrice: number } {
        let price = product.children
          ? Array.from(product.children)[1]
              .textContent?.split("AED ")
              .filter((val: any) => val)
          : null;
        if (price) {
          return { sellingPrice: Number(price[0]), currency: "AED", priceBeforeDiscount: Number(price[1]) };
        }
        return { sellingPrice: NaN, currency: "AED", priceBeforeDiscount: NaN };
      }

      function extractHasPromotion(product: Element): boolean | undefined {
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
    const totalArr = document.querySelector("#category-loadmore-layout")?.textContent?.split(" products out of ");
    if (totalArr && totalArr.length > 0) {
      return Math.floor(Number(totalArr[1].replace(/\D/gm, "")) / 48);
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

const getCategory = (url: string) => {
  if (url.includes("shoes")) return "footwear";
};

export default { extractProducts, getLastPage, getGender, getCategory };
