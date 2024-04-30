import { CreateSpiderProps, ExtractFn, LoadFn, ScrapeUrlDefaultSpecs, SpiderDefaultSpecs, TransfomFn } from "./types";

export const createSpider = (spiderName: string, defaultSpecs: SpiderDefaultSpecs) => {
  return class Spider {
    private spiderName: string = spiderName;
    private extractFn: ExtractFn;
    private transformFn: TransfomFn;
    private loadFn: LoadFn;

    async scrape(url: string, specs: ScrapeUrlDefaultSpecs) {
      const data = await this.extractFn(url);
      const products = this.transformFn({ data, defaultSpecs: { ...defaultSpecs, ...specs } });
    }
  };
};
