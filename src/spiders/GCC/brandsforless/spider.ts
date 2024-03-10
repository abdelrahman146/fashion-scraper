import { Page } from "puppeteer";
import { Spider } from "../../../core/Spider";
import { pages } from "./resources";
import tasks from "./tasks";

export class Spider_BrandsForLess extends Spider {
  totalScraped = 0;
  reloadTries = 0;
  constructor() {
    super("brandsforless");
  }
  async navigateWithRetry(page: Page, url: string, maxRetries = 3): Promise<boolean> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector("ul.pagination > li");
        return true;
      } catch (error) {
        this.log(`❗ Navigation attempt ${retries + 1} failed with timeout error. Retrying...`);
        retries++;
        await this.break(15000, 30000);
      }
    }
    this.logr(`⛔ Navigation failed after ${maxRetries} attempts. for ${url}`);
    return false;
  }

  async extract(url: string): Promise<number> {
    this.totalScraped = 0;
    const scraped = await this.checkIfScraped(url);
    if (scraped) return 0;
    const browser = await this.launchWithRetry(url);
    if (!browser) return -1;
    const page = await browser.newPage();
    const success = this.navigateWithRetry(page, url);
    if (!success) return -2;
    await this.break(15000, 30000, "Warming up");
    const isArabic = await tasks.checkIfArabic(page);
    if (isArabic) {
      this.log(`❌ ${url} is in Arabic. Try ${this.reloadTries + 1} reloading...`);
      this.reloadTries++;
      if (this.reloadTries > 3) {
        this.logr(`⛔ ${url} is in Arabic. Retried ${this.reloadTries} times. Skipping...`);
        return -400;
      } else {
        this.extract(url);
      }
    } else {
      this.reloadTries = 0;
    }
    const lastPage = await tasks.getLastPage(page);
    if (lastPage == -1) {
      this.logr(`⛔ Failed to get last page for ${url}`);
      this.reloadTries++;
      if (this.reloadTries > 3) {
        this.logr(`⛔ ${url} unable to evaluate. Retried ${this.reloadTries} times. Skipping...`);
        return -400;
      } else {
        this.extract(url);
      }
    } else {
      this.reloadTries = 0;
    }
    for (let i = 1; i <= lastPage; i++) {
      const url_paginated = i > 1 ? url + "?page=" + i : url;
      if (i > 1) {
        const success = await this.navigateWithRetry(page, url_paginated);
        if (!success) continue;
        await this.break(15000, 30000, "Loading data");
      }
      const data = await tasks.extractProducts(page, this.totalScraped);
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
