// src/extractors/webExtractor.ts
import { Observable } from "rxjs";
import { ProductRawData } from "../../types";
import { closeBrowserOnError, navigate, setupBrowser } from "../../utils/puppeteer.utils";
import tasks from "./tasks";
import { takeBreak } from "../../utils/common.utils";
import { Browser } from "puppeteer";

export function NamshiListPageExtractor(url: string): Observable<ProductRawData[]> {
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
        const lastPage = await tasks.getLastPage(page);
        if (lastPage === -1) {
          await page.close();
          await browser.close();
          observer.complete();
          return;
        }
        let totalScraped = 0;
        for (let i = 1; i <= lastPage; i++) {
          const url_paginated = i > 1 ? url + "&p=" + i : url;
          if (i > 1) {
            const success = await navigate(page, url_paginated, { timeout: 120000 });
            if (!success || success === -1) continue;
            await takeBreak(15000, 30000, "Loading data, waiting for");
          }
          await tasks.fetchAllProducts(page);
          const data = await tasks.extractProducts(page, totalScraped);
          if (data === -1) continue;
          totalScraped = totalScraped + data.length;
          observer.next(data);
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
