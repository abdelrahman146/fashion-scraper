// src/extractors/webExtractor.ts
import { Observable } from "rxjs";
import { ProductRawData } from "../../types";
import { navigate, setupBrowser } from "../../utils/puppeteer.utils";
import tasks from "./tasks";
import { takeBreak } from "../../utils/common.utils";

export function SixthStreetListPageExtractor(url: string): Observable<ProductRawData[]> {
  return new Observable<ProductRawData[]>((observer) => {
    // Start the async operation inside the observable
    const start = async () => {
      try {
        const browser = await setupBrowser();
        const page = await browser.newPage();
        const success = await navigate(page, url, { timeout: 120000 });
        if (!success || success === -1) {
          await page.close();
          await browser.close();
          throw new Error(`❌ Navigation to ${url} failed`);
        }
        let totalProducts = 0;
        let tries = 1;
        while (true) {
          const data = await tasks.extractProducts(page, totalProducts);
          if (data === -1) {
            throw new Error(`❌ Failed to extract products from ${url}`);
          }
          if (data.length === 0) {
            tries++;
          } else {
            tries = 1;
            totalProducts += data.length;
            observer.next(data);
          }
          const hasMore = await tasks.loadMore(page);
          if (hasMore === -1) {
            throw new Error(`❌ Failed to load more from ${url}`);
          }
          if (!hasMore || tries > 3) break;
          await tasks.scroll(page);
          await takeBreak(3000, 15000, "Loading data");
        }
        await page.close();
        await browser.close();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    };

    // Execute the async operation
    start();
  });
}
