import { Spider } from "../../../core/Spider";
import { colors, pages } from "./resources";
import tasks from "./tasks";

export class Spider_6thStreet extends Spider {
  totalScraped = 0;
  constructor() {
    super("6thstreet");
  }

  async extract(url: string): Promise<number> {
    this.totalScraped = 0;
    const scraped = await this.checkIfScraped(url);
    if (scraped) return 0;
    const browser = await this.launchWithRetry(url);
    if (!browser) return -1;
    const page = await browser.newPage();
    const success = this.navigateWithRetry(page, url);
    if (!success) {
      await browser.close();
      return -2;
    }
    await this.break(10000, 15000, "Warming up");
    let tries = 1;
    while (true) {
      const data = await tasks.extractProducts(page, this.totalScraped);
      const products = this.transform({
        data,
        globalAttributes: {
          source: this.source,
          website: "https://en-ae.6thstreet.com/",
          region: "GCC",
          currency: "AED",
          listingUrl: url,
        },
        listingOrderStartFrom: this.totalScraped,
        fallbacks: this.getFallbacks(),
      });
      await this.load(products);
      if (data.length === 0) {
        tries++;
      } else {
        tries = 1;
        this.totalScraped += data.length;
        this.log(`🟩 Scraped ${data.length}. total scraped: ${this.totalScraped}`);
      }
      const hasMore = await tasks.loadMore(page);
      if (!hasMore || tries > 3) break;
      await tasks.scroll(page);
      await this.break(3000, 15000, "Loading data");
    }
    await this.registerAsScraped(url);
    await browser.close();
    return 1;
  }

  async crawl(): Promise<void> {
    for (let url of pages) {
      for (const color of colors) {
        const colored_url = url + "&dFR[colorfamily][0]=" + color;
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
