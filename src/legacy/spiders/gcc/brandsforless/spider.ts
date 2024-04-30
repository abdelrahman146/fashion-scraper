import { GoToOptions, HTTPResponse, Page } from "puppeteer";
import { Spider } from "../../../core/Spider";
import { pages } from "./resources";
import tasks from "./tasks";
import { promiseWithRetry } from "../../../core/utils/common.utils";

export class Spider_BrandsForLess extends Spider {
  totalScraped = 0;
  constructor() {
    super("brandsforless");
  }

  /**
   * Override the default navigate method to handle random Arabic pages
   */
  async navigate(page: Page, url: string, options?: GoToOptions): Promise<HTTPResponse | -1 | null> {
    return promiseWithRetry(
      async () => {
        const res = await page.goto(url, { waitUntil: "domcontentloaded", ...options });
        await page.waitForSelector("h1.product_title");
        const isArabic = await tasks.checkIfArabic(page);
        if (isArabic) {
          await this.break(5000, 10000, `❌ ${url} is in Arabic. reloading after`);
          return this.navigate(page, url, options);
        } else {
          return res;
        }
      },
      {
        failCallback: (_error, retries) => {
          this.log(`❗ Navigation tp ${url} failed. Attempt: ${retries}. Retrying...`);
        },
      }
    );
  }

  async extract(url: string): Promise<number> {
    this.totalScraped = 0;
    const scraped = await this.checkIfScraped(url);
    if (scraped) return 0;
    const result = await this.initializeBrowser();
    if (result === -1) return -1;
    const { page, browser } = result;
    const success = await this.navigate(page, url);
    if (!success || success === -1) {
      await browser.close();
      return -2;
    }
    await this.break(15000, 30000, "Warming up for");
    const lastPage = await tasks.getLastPage(page);
    if (lastPage === -1) {
      this.logr(`⛔ Failed to get last page for ${url}`);
      return -400;
    }
    for (let i = 1; i <= lastPage; i++) {
      const url_paginated = i > 1 ? url + "?page=" + i : url;
      if (i > 1) {
        const success = await this.navigate(page, url_paginated);
        if (!success || success === -1) continue;
        await this.break(15000, 30000, "Loading data, waiting for");
      }
      const data = await tasks.extractProducts(page);
      if (data === -1) continue;
      const products = this.transform({
        data,
        globalAttributes: {
          source: this.source,
          website: "https://www.brandsforless.com",
          region: "GCC",
          currency: "AED",
          listingUrl: url,
        },
        listingOrderStartFrom: this.totalScraped,
        fallbacks: this.getFallbacks(),
      });
      await this.load(products);
      this.totalScraped += data.length;
      this.log(`🟩 Scraped ${data.length}. total scraped: ${this.totalScraped}`);
    }
    this.registerAsScraped(url);
    await browser.close();
    return 1;
  }

  async crawl(): Promise<void> {
    for (let url of pages) {
      const start = this.start(url);
      this.setFallbacks({ gender: tasks.getGender(url), category: tasks.getCategory(url) });
      const status = await this.extract(url);
      if (status === -1) {
        this.log(`❌ Failed to launch browser for ${url}`);
        continue;
      }
      if (status === -2) {
        this.log(`❌ Failed to navigate to ${url}`);
        continue;
      }
      if (status === 0) {
        this.log(`✅ ${url} has already been scraped`);
        continue;
      }
      if (status === -400) {
        this.log(`❌ ${url} is in Arabic. Skipping...`);
        continue;
      }
      this.finish(start, this.totalScraped);
      await this.break(30000, 180000);
    }
  }
}
