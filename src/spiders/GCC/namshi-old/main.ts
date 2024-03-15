import { log, logr } from "../../../core/log";
import { getRandomInteger } from "../../../core/utils/number.utils";
import { spider } from "./spider";
import moment from "moment";

const pages = [
  { url: "https://www.namshi.com/uae-en/men-clothing/", gender: "male" },
  { url: "https://www.namshi.com/uae-en/women-clothing/", gender: "female" },
  { url: "https://www.namshi.com/uae-en/kids-clothing/", gender: "kids" },
  { url: "https://www.namshi.com/uae-en/women-shoes/fashion-footwear-accessories/", gender: "female", category: "footwear" },
  { url: "https://www.namshi.com/uae-en/kids-shoes/", category: "footwear", gender: "kids" },
  { url: "https://www.namshi.com/uae-en/men/fashion-footwear/", category: "footwear", gender: "male" },
  { url: "https://www.namshi.com/uae-en/women-bags/fashion-bags/", gender: "female", category: "bag" },
];

const colors = [
  "blue",
  "green",
  "gold",
  "silver",
  "multicolour",
  "grey",
  "purple",
  "red",
  "orange",
  "yellow",
  "clear",
  "black",
  "white",
  "beige",
  "pink",
  "brown",
];

(async () => {
  for (let { url, gender, category } of pages) {
    for (const color of colors) {
      const colored_url = url + "?f%5Bcolour_family%5D=" + color;
      logr(`🕷️  Assigned [NAMSHI_SPIDER] for ${colored_url}`);
      const start = moment();
      const total = await spider({ url: colored_url, defaultGender: gender, defaultCategory: category, defaultColor: color });
      if (total === -3 || total === 0) continue;
      const finish = moment();
      const time = finish.diff(start, "milliseconds");
      logr(`🕷️  [NAMSHI_SPIDER] ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
      const timeout = getRandomInteger(30000, 180000);
      log(`🕷️  [NAMSHI_SPIDER] ⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
      await new Promise((r) => setTimeout(r, timeout));
    }
  }
})();
