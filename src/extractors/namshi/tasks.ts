import { Page } from "puppeteer";
import { promiseWithRetry } from "../../utils/common.utils";
import { ProductRawData } from "../../types";

async function extractProducts(page: Page, totalScraped: number): Promise<ProductRawData[] | -1> {
  return promiseWithRetry(
    () => {
      return page.evaluate((totalScraped) => {
        /**
         * Extractors START
         */
        function extractId(product: Element): string | undefined {
          let url = product.querySelector('a[class*="ProductBox_productBox__"]')?.getAttribute("href");
          if (url) {
            url = url.trim().replace(/\/$/, "");
            const parts = url.split("/");
            // return parts[parts.length - 3] + "/" + parts[parts.length - 2];
            return parts[parts.length - 2];
          }
        }

        function extractImg(product: Element): string | undefined {
          let src = product.querySelector("img")?.src;
          return src;
        }

        function extractUrl(product: Element): string | undefined {
          const href = product.querySelector('a[class*="ProductBox_productBox__"]')?.getAttribute("href");
          return href ? href : undefined;
        }

        function extractTitle(product: Element): string | undefined {
          return product.querySelector('div[class*="ProductBox_productTitle__"]')?.textContent?.trim();
        }

        function extractBrand(product: Element): string | undefined {
          return product.querySelector('div[class*="ProductBox_brand__"]')?.textContent?.trim();
        }

        function extractPrice(product: Element): { priceBeforeDiscount?: number; currency: string; sellingPrice: number } {
          let sellingPrice = product.querySelector('span[class*="ProductPrice_value__"]')?.textContent?.trim().replace(/\D/g, "");
          let currency = product.querySelector('span[class*="ProductPrice_currency__"]')?.textContent?.trim().toUpperCase() || "AED";
          let priceBeforeDiscount = product.querySelector('div[class*="ProductPrice_preReductionPrice__"]')?.textContent?.trim().replace(/\D/g, "");

          return { sellingPrice: Number(sellingPrice), currency, priceBeforeDiscount: Number(priceBeforeDiscount) };
        }

        function extractHasPromotion(product: Element): boolean | undefined {
          let promo = product.querySelector('div[class*="ProductDiscountTag_discountTag__"]')?.textContent?.trim();
          if (promo) {
            return true;
          }
          return false;
        }
        /**
         * Extractors END
         */

        const products = Array.from(document.querySelectorAll('div[class*="ProductBox_container__"]'));

        return products.reduce((acc: ProductRawData[], product: Element, index) => {
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
            const listingOrder = totalScraped + index + 1;
            return [...acc, { pid, title, image, brand, price, url, hasPromotion, listingOrder }];
          } catch {
            return acc;
          }
        }, []);
      }, totalScraped);
    },
    {
      failCallback: (_error, retries) => {
        console.log(`❗ Failed to extract products. Attempt: ${retries}. Retrying...`);
      },
    }
  );
}

async function getLastPage(page: Page): Promise<number> {
  return page.evaluate(() => {
    const p = document.querySelectorAll('a[class*="PlpPagination_paginationItem__"]');
    if (p.length > 0) {
      return Number(p[p.length - 1].textContent);
    } else {
      return 1;
    }
  });
}

async function fetchAllProducts(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return new Promise<boolean>((resolve) => {
      let scrollPercentage = 0.2;
      const intervalId = setInterval(() => {
        window.scrollTo({
          top: document.body.scrollHeight * scrollPercentage,
          behavior: "smooth",
        });
        if (scrollPercentage < 0.9) {
          scrollPercentage = scrollPercentage + 0.1;
        } else {
          clearInterval(intervalId);
          resolve(true);
        }
      }, 1500);
    });
  });
}

const getGender = (url: string) => {
  if (url.includes("/men")) return "men";
  if (url.includes("/women")) return "women";
  if (url.includes("/boys")) return "boys";
  if (url.includes("/girls")) return "girls";
  return "unisex";
};

export default { extractProducts, getLastPage, fetchAllProducts, getGender };
