import { log, logr } from "../../core/log";
import { getRandomInteger } from "../../core/number.utils";
import { spider } from "./spider";
import moment from "moment";

const pages = ["https://www.maxfashion.com/ae/en/c/mxmen", "https://www.maxfashion.com/ae/en/c/mxwomen"];

const colors = [
  "beige",
  "black",
  "blue",
  "brown",
  "cream",
  "gold",
  "green",
  "grey",
  "multicolour",
  "orange",
  "pink",
  "purple",
  "red",
  "white",
  "yellow",
];

const getGender = (url: string) => {
  if (url.includes("mxmen")) return "male";
  if (url.includes("mxwomen")) return "female";
  return "unisex";
};

(async () => {
  for (let url of pages) {
    for (const color of colors) {
      const colored_url = url + "?q=:color.en:" + color;
      logr(`🕷️  Assigned [MAX_SPIDER] for ${colored_url}`);
      const start = moment();
      const total = await spider({ url: colored_url, defaultGender: getGender(url), defaultColor: color });
      if (total === -3 || total === 0) continue;
      const finish = moment();
      const time = finish.diff(start, "milliseconds");
      logr(`🕷️  [MAX_SPIDER] ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
      const timeout = getRandomInteger(30000, 180000);
      log(`🕷️  [MAX_SPIDER] ⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
      await new Promise((r) => setTimeout(r, timeout));
    }
  }
})();
