import { Page } from "puppeteer";
import { Data } from "../../../core/Spider";
import { promiseWithRetry } from "../../../core/utils/common.utils";

async function extractProducts(page: Page, totalScraped: number): Promise<Data[] | -1> {
  return promiseWithRetry(
    () => {
      return page.evaluate((totalScraped) => {
        /**
         * Extractors START
         */
        function extractId(product: Element): string | undefined {
          return product.getAttribute("data-contentid") || undefined;
        }

        function extractImg(product: Element): string | undefined {
          let src = product.querySelector("img")?.src;
          return src;
        }

        function extractUrl(product: Element): string | undefined {
          const href = product.querySelector("[data-testid='product-url']")?.getAttribute("href");
          return href ? href : undefined;
        }

        function extractTitle(product: Element): string | undefined {
          return product.querySelector(".name")?.textContent?.trim().replace(/,/gm, "");
        }

        function extractBrand(product: Element): string | undefined {
          return product.querySelector(".brand")?.textContent?.trim();
        }

        function extractPrice(product: Element): { priceBeforeDiscount?: number; currency: string; sellingPrice: number } {
          let sellingPrice = product.querySelector("span.Price-Special")?.textContent?.trim().replace(/\D/g, "");
          let priceBeforeDiscount = product.querySelector(".Price-Del")?.textContent?.trim().replace(/\D/g, "");
          let currency = product.querySelector(".Price-Currency")?.textContent?.trim().toUpperCase() || "AED";
          if (!sellingPrice) {
            sellingPrice = product.querySelector(".Price")?.textContent?.trim().replace(/\D/g, "");
          }
          return { sellingPrice: Number(sellingPrice), currency, priceBeforeDiscount: Number(priceBeforeDiscount) };
        }

        function extractHasPromotion(product: Element): boolean | undefined {
          let priceBeforeDiscount = product.querySelector(".PLPSummary-Exclusive")?.textContent?.trim().replace(/\D/g, "");
          if (priceBeforeDiscount) {
            return true;
          }
          return false;
        }
        /**
         * Extractors END
         */

        const products = Array.from(document.querySelectorAll("li.ProductItem"));

        return products.slice(totalScraped).reduce((acc: Data[], product: Element) => {
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
      }, totalScraped);
    },
    {
      failCallback: (_error, retries) => {
        console.log(`❗ Failed to extract products. Attempt: ${retries}. Retrying...`);
      },
    }
  );
}
