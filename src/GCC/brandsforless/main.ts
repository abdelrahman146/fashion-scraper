import { log, logr } from "../../core/log";
import { getRandomInteger } from "../../core/number.utils";
import { spider } from "./spider";
import moment from "moment";

const pages = [
  "https://www.brandsforless.com/en-ae/men/clothing",
  "https://www.brandsforless.com/en-ae/men/shoes",
  "https://www.brandsforless.com/en-ae/men/bags",
  "https://www.brandsforless.com/en-ae/women/clothing",
  "https://www.brandsforless.com/en-ae/women/shoes",
  "https://www.brandsforless.com/en-ae/women/bags",
  "https://www.brandsforless.com/en-ae/kids/boys",
  "https://www.brandsforless.com/en-ae/kids/boys/footwear",
  "https://www.brandsforless.com/en-ae/kids/girls",
  "https://www.brandsforless.com/en-ae/kids/girls/footwear",
];

const getGender = (url: string) => {
  if (url.includes("men")) return "male";
  if (url.includes("women")) return "female";
  if (url.includes("kids/boys")) return "kids/boy";
  if (url.includes("kids/girls")) return "kids/girl";
  return "unisex";
};

const getCategory = (url: string) => {
  if (url.includes("footwear") || url.includes("shoes")) return "footwear";
  if (url.includes("bags")) return "bag";
};

(async () => {
  for (let url of pages) {
    logr(`🕷️  Assigned [BRANDSFORLESS_SPIDER] for ${url}`);
    const start = moment();
    const total = await spider({ url: url, defaultGender: getGender(url), defaultCategory: getCategory(url) });
    if (total === -3 || total === 0) continue;
    const finish = moment();
    const time = finish.diff(start, "milliseconds");
    logr(`🕷️  [BRANDSFORLESS_SPIDER] ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
    const timeout = getRandomInteger(30000, 180000);
    log(`🕷️  [BRANDSFORLESS_SPIDER] ⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
    await new Promise((r) => setTimeout(r, timeout));
  }
})();
