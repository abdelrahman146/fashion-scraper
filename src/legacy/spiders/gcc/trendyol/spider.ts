import { Spider } from "../../../core/Spider";
import { pages } from "./resources";

export class Spider_Trendyol extends Spider {
  totalScraped: number;
  constructor() {
    super("trendyol");
    this.totalScraped = 0;
  }

  async extract(url: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  async crawl(): Promise<void> {
    for (const { url, category, gender } of pages) {
      const start = this.start(url);
      this.setFallbacks({ gender, category });
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
