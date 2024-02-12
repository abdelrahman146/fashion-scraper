import { log, logr } from "../../../core/log";
import { getRandomInteger } from "../../../core/number.utils";
import { spider } from "./spider";
import moment from "moment";

const pages = [
  // { url: "https://www.trendyol.com/en/men-t-shirts-x-g2-c73", gender: "male", category: "top" },
  // { url: "https://www.trendyol.com/en/men-sweatshirts-x-g2-c1179", gender: "male", category: "top" },
  // { url: "https://www.trendyol.com/en/men-sneakers-x-g2-c1172", gender: "male", category: "footwear" },
  // { url: "https://www.trendyol.com/en/men-shoulder-bags-x-g2-c101465", gender: "male", category: "bag" },
  // { url: "https://www.trendyol.com/en/men-socks-x-g2-c1038", gender: "male", category: "underwear" },
  // { url: "https://www.trendyol.com/en/men-shirts-x-g2-c75", gender: "male", category: "top" },
  // { url: "https://www.trendyol.com/en/men-boxer-shorts-x-g2-c61", gender: "male", category: "underwear" },
  // { url: "https://www.trendyol.com/en/men-camisoles-x-g2-c1004", gender: "male", category: "underwear" },
  // { url: "https://www.trendyol.com/en/men-hats-x-g2-c1181", gender: "male", category: "hat" },
  // { url: "https://www.trendyol.com/en/men-boots-x-g2-c1025", gender: "male", category: "footwear" },
  // { url: "https://www.trendyol.com/en/men-backpacks-x-g2-c115", gender: "male", category: "bag" },
  // { url: "https://www.trendyol.com/en/men-sweaters-x-g2-c1092", gender: "male", category: "top" },
  { url: "https://www.trendyol.com/en/men-pants-x-g2-c70", gender: "male", category: "bottom" },
  { url: "https://www.trendyol.com/en/men-sweatpants-x-g2-c101451", gender: "male", category: "bottom" },
  // { url: "https://www.trendyol.com/en/men-walking-shoes-x-g2-c101429", gender: "male", category: "footwear" },
  // { url: "https://www.trendyol.com/en/men-beanies-x-g2-c1015", gender: "male", category: "hat" },
  // { url: "https://www.trendyol.com/en/men-winter-jackets-x-g2-c118", gender: "male", category: "outerwear" },
  { url: "https://www.trendyol.com/en/men-capri-pants-bermudas-x-g2-c101484", gender: "male", category: "bottom" },
  { url: "https://www.trendyol.com/en/men-shorts-x-g2-c119", gender: "male", category: "top" },
  // { url: "https://www.trendyol.com/en/men-pajama-sets-x-g2-c101496", gender: "male", category: "set" },
  // { url: "https://www.trendyol.com/en/men-jackets-x-g2-c1030", gender: "male", category: "outerwear" },
  { url: "https://www.trendyol.com/en/men-plus-size-t-shirts-x-g2-c102777", gender: "male", category: "top" },
  // { url: "https://www.trendyol.com/en/men-jean-x-g2-c120", gender: "male", category: "bottom" },
  // { url: "https://www.trendyol.com/en/men-polo-collar-t-shirts-x-g2-c108775", gender: "male", category: "top" },
  // { url: "https://www.trendyol.com/en/men-two-piece-sets-x-g2-c83", gender: "male", category: "set" },
  // { url: "https://www.trendyol.com/en/men-cardigans-x-g2-c1066", gender: "male", category: "outerwear" },
  // { url: "https://www.trendyol.com/en/men-vests-x-g2-c1207", gender: "male", category: "outerwear" },
  // { url: "https://www.trendyol.com/en/women-t-shirts-x-g1-c73", gender: "female", category: "top" },
  // { url: "https://www.trendyol.com/en/women-sweatshirts-x-g1-c1179", gender: "female", category: "top" },
  // { url: "https://www.trendyol.com/en/women-shoulder-bags-x-g1-c101465", gender: "female", category: "bag" },
  { url: "https://www.trendyol.com/en/women-dresses-x-g1-c56", gender: "female", category: "formalwear" },
  // { url: "https://www.trendyol.com/en/women-socks-x-g1-c1038", gender: "female", category: "underwear" },
  // { url: "https://www.trendyol.com/en/women-blouses-x-g1-c1019", gender: "female", category: "top" },
  // { url: "https://www.trendyol.com/en/women-briefs-x-g1-c1105", gender: "female", category: "underwear" },
  { url: "https://www.trendyol.com/en/women-bras-x-g1-c63", gender: "female", category: "underwear" },
  { url: "https://www.trendyol.com/en/women-pajama-sets-x-g1-c101496", gender: "female", category: "set" },
  // { url: "https://www.trendyol.com/en/women-sneakers-x-g1-c1172", gender: "female", category: "footwear" },
  { url: "https://www.trendyol.com/en/women-boots-x-g1-c1025", gender: "female", category: "footwear" },
  { url: "https://www.trendyol.com/en/women-pants-x-g1-c70", gender: "female", category: "bottom" },
  // { url: "https://www.trendyol.com/en/women-sweaters-x-g1-c1092", gender: "female", category: "top" },
  { url: "https://www.trendyol.com/en/women-camisoles-x-g1-c1004", gender: "female", category: "underwear" },
  // { url: "https://www.trendyol.com/en/women-mules-x-g1-c110", gender: "female", category: "footwear" },
  { url: "https://www.trendyol.com/en/women-leggings-x-g1-c121", gender: "female", category: "bottom" },
  // { url: "https://www.trendyol.com/en/women-hats-x-g1-c1181", gender: "female", category: "hat" },
  // { url: "https://www.trendyol.com/en/women-two-piece-sets-x-g1-c83", gender: "female", category: "set" },
  // { url: "https://www.trendyol.com/en/women-shirts-x-g1-c75", gender: "female", category: "top" },
  // { url: "https://www.trendyol.com/en/women-corsets-x-g1-c1100", gender: "female", category: "underwear" },
  // { url: "https://www.trendyol.com/en/women-high-heels-x-g1-c103718", gender: "female", category: "footwear" },
  // { url: "https://www.trendyol.com/en/women-jackets-x-g1-c1030", gender: "female", category: "outerwear" },
  { url: "https://www.trendyol.com/en/women-cardigans-x-g1-c1066", gender: "female", category: "outerwear" },
  { url: "https://www.trendyol.com/en/women-sweatpants-x-g1-c101451", gender: "female", category: "bottom" },
  // { url: "https://www.trendyol.com/en/women-sandals-x-g1-c111", gender: "female", category: "footwear" },
  // { url: "https://www.trendyol.com/en/women-sweatsuit-sets-x-g1-c101452", gender: "female", category: "set" },
  // { url: "https://www.trendyol.com/en/women-skirts-x-g1-c69", gender: "female", category: "bottom" },
  // { url: "https://www.trendyol.com/en/women-winter-jackets-x-g1-c118", gender: "female", category: "outerwear" },
  // { url: "https://www.trendyol.com/en/women-jean-x-g1-c120", gender: "female", category: "bottom" },
  // { url: "https://www.trendyol.com/en/women-underwear-sets-x-g1-c104536", gender: "female", category: "underwear" },
  // { url: "https://www.trendyol.com/en/women-nightgowns-x-g1-c62", gender: "female", category: "underwear" },
  // { url: "https://www.trendyol.com/en/women-ballerina-flats-x-g1-c113", gender: "female", category: "footwear" },
  // { url: "https://www.trendyol.com/en/women-bodysuits-x-g1-c1020", gender: "female", category: "set" },
  // { url: "https://www.trendyol.com/en/women-tunics-x-g1-c72", gender: "female", category: "top" },
  { url: "https://www.trendyol.com/en/women-evening-prom-dresses-x-g1-c55", gender: "female", category: "formalwear" },
  // { url: "https://www.trendyol.com/en/women-evening-shoes-x-g1-c101430", gender: "female", category: "footwear" },
  // { url: "https://www.trendyol.com/en/women-handbags-x-g1-c104145", gender: "female", category: "bag" },
  // { url: "https://www.trendyol.com/en/women-messenger-bag-x-g1-c1152", gender: "female", category: "bag" },
];

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

(async () => {
  shuffle(pages);
  for (const { url, category, gender } of pages) {
    logr(`🕷️  Assigned [TRENDYOL_SPIDER] for ${url}`);
    const start = moment();
    const scraped = await spider({ url, defaultCategory: category, defaultGender: gender });
    if (scraped === -1) {
      log(`🕷️  [TRENDYOL_SPIDER] ✔️ ${url} is already scraped ...`);
      continue;
    }
    const finish = moment();
    const time = finish.diff(start, "milliseconds");
    logr(`🕷️  [TRENDYOL_SPIDER] ✅ Succesffully scraped ` + scraped + ` from ${url} ` + moment.duration(time).humanize(true));
    const timeout = getRandomInteger(30000, 180000);
    log(`⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
    await new Promise((r) => setTimeout(r, timeout));
  }
})();
