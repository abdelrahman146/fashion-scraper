import { Page } from "puppeteer";
import { Data } from "../../../core/Spider";
import { getRandomInteger } from "../../../core/utils/number.utils";
import { promiseWithRetry } from "../../../core/utils/common.utils";

/**
 * Extracts product data from a web page.
 *
 * @param page - The page to extract data from.
 * @param totalScraped - The total number of products already scraped.
 * @returns A promise that resolves to an array of product data.
 */
async function extractProducts(page: Page, totalScraped: number): Promise<Data[] | -1> {
  return promiseWithRetry(
    () => {
      return page.evaluate((totalScraped) => {
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
          return product.querySelector("p.ProductItem-Title")?.textContent?.trim();
        }

        function extractBrand(product: Element): string | undefined {
          return product.querySelector("h2.ProductItem-Brand")?.textContent?.trim();
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

/**
 * Retrieves the total number of products from the page.
 * If the page has a specific element with class "Product-Loaded-Info", it extracts the number from its text content.
 * Otherwise, it counts the number of elements with class "ProductItem".
 * @param page The page to retrieve the total number of products from.
 * @returns A promise that resolves to the total number of products.
 */
async function getTotalProducts(page: Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.querySelector(".Product-Loaded-Info");
    if (el) {
      return Number(el.textContent?.split(" ").filter((i) => Number(i))[1]);
    } else {
      return document.querySelectorAll("li.ProductItem").length;
    }
  });
}

/**
 * Loads more content on the page by clicking the load button.
 * @param page - The page to perform the action on.
 * @returns A promise that resolves to a boolean indicating whether the load button was successfully clicked.
 */
async function loadMore(page: Page): Promise<boolean | -1> {
  return promiseWithRetry(
    () => {
      return page.evaluate(() => {
        const loadButton = document.querySelector(".LoadMore > button") as HTMLButtonElement;
        if (loadButton && !loadButton.disabled) {
          loadButton.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          loadButton.click();
          return true;
        } else {
          return false;
        }
      });
    },
    {
      failCallback: (_error, retries) => {
        console.log(`❗ Failed to load more. Attempt: ${retries}. Retrying...`);
      },
    }
  );
}

/**
 * Scrolls the page by a specified amount.
 * @param page - The page to scroll.
 * @returns A Promise that resolves when the scrolling is complete.
 */
async function scroll(page: Page) {
  return page.evaluate(() => {
    window.scrollBy({ top: -500, behavior: "smooth" });
  });
}

/**
 * Determines the gender based on the provided URL.
 * @param url - The URL to check for gender keywords.
 * @returns The gender category: "female", "male", "kids/boy", "kids/girl", or "unisex".
 */
function getGender(url: string): string {
  if (url.includes("women")) return "female";
  if (url.includes("men")) return "male";
  if (url.includes("boy")) return "kids/boy";
  if (url.includes("girl")) return "kids/girl";
  return "unisex";
}

/**
 * Retrieves the category based on the provided URL.
 * @param url - The URL to check for the category.
 * @returns The category of the URL, or undefined if it doesn't match any category.
 */
function getCategory(url: string): string | undefined {
  if (url.includes("footwear")) return "footwear";
}

function calculateTimeEstimate(totalProducts: number): number {
  const pages = Math.floor(totalProducts / 30);
  const loadTime = [...Array(pages + 1).keys()].reduce((tot, curr) => {
    const timeout = getRandomInteger(1000, 5000) * curr * 0.5;
    return tot + timeout;
  }, 0);
  const pauseTime = [...Array(pages + 1).keys()].reduce((tot, curr) => {
    const timeout = getRandomInteger(1000, 4000);
    return tot + timeout;
  }, 0);
  return loadTime + pauseTime;
}

export default { extractProducts, getCategory, getGender, getTotalProducts, loadMore, scroll };
