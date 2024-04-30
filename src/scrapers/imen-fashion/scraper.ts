import moment from "moment";
import { NamshiConfig, SixthStreetConfig } from "./config";
import { SixthStreetListPageExtractor } from "../../extractors/6thstreet.com/list-page.extractor";
import { NamshiListPageExtractor } from "../../extractors/namshi/list-page.extractor";
import { SiteConfig } from "../../types";
import { extractStream, loadStream } from "../streams.common";
import { namshiFilter, sixthStreetFilter } from "./filters";

const outputFile = `src/scrapers/imen-fashion/fashion-${moment().format("DDMMyyyy")}.csv`;

const siteConfigs: SiteConfig[] = [
  {
    siteName: "6thstreet.com",
    config: SixthStreetConfig,
    extractor: SixthStreetListPageExtractor,
    outputFile,
    filtersStream: sixthStreetFilter,
  },
  {
    siteName: "namshi.com",
    config: NamshiConfig,
    extractor: NamshiListPageExtractor,
    outputFile,
    filtersStream: namshiFilter,
  },
];

(async () => {
  try {
    for (const siteConfig of siteConfigs) {
      let stream$ = extractStream(siteConfig);
      if (siteConfig.filtersStream) stream$ = siteConfig.filtersStream(stream$);

      const loadStream$ = loadStream(stream$, siteConfig);
      loadStream$.subscribe({
        next: (count) => console.log(`✅ ${count} products extracted from ${siteConfig.siteName}`),
        error: (error) => console.error(`❌ Failed to extract products from ${siteConfig.siteName}`, error),
        complete: () => console.log(`✅ Extraction from ${siteConfig.siteName} completed`),
      });
    }
  } catch (error: any) {}
  try {
  } finally {
  }
})();
