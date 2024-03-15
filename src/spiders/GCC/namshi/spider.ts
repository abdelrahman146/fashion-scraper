import { Spider } from "../../../core/Spider";
import { colors, pages } from "./resources";
import tasks from "./tasks";

export class Spider_Namshi extends Spider {
  totalScraped: number;
  constructor() {
    super("namshi");
    this.totalScraped = 0;
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
      const url_paginated = i > 1 ? url + "&p=" + i : url;
      if (i > 1) {
        const success = await this.navigate(page, url_paginated);
        if (!success || success === -1) continue;
        await this.break(15000, 30000, "Loading data, waiting for");
      }
      await tasks.fetchAllProducts(page);
      const data = await tasks.extractProducts(page);
      if (data === -1) continue;
      const products = this.transform({
        data,
        globalAttributes: {
          source: this.source,
          website: "https://www.namshi.com",
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
      for (const color of colors) {
        const colored_url = url + "?q=color.en:" + color;
        const start = this.start(colored_url);
        this.setFallbacks({ color, gender: tasks.getGender(url) });
        const status = await this.extract(colored_url);
        if (status === -1) {
          this.log(`❌ Failed to launch browser for ${colored_url}`);
          continue;
        }
        if (status === -2) {
          this.log(`❌ Failed to navigate to ${colored_url}`);
          continue;
        }
        if (status === -3) {
          this.log(`❌ Failed to extract all data from ${colored_url}`);
          continue;
        }
        if (status === 0) {
          this.log(`✅ ${colored_url} has already been scraped`);
          continue;
        }
        this.finish(start, this.totalScraped);
        await this.break(30000, 180000);
      }
    }
  }
}
