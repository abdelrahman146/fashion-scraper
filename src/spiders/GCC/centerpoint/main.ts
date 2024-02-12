import { log, logr } from "../../../core/log";
import { getRandomInteger } from "../../../core/number.utils";
import { spider } from "./spider";
import moment from "moment";

const pages = [
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-winterwear",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-tops",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-bottoms",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-sportswearandactivewear",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-plussizeclothing",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-ethnicwear",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-underwear",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-nightwear",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-swimwear",
  "https://www.centrepointstores.com/ae/en/c/cpmen-clothing-sets",
  "https://www.centrepointstores.com/ae/en/c/cpmen-footwear-sportsshoes",
  "https://www.centrepointstores.com/ae/en/c/cpmen-footwear-sneakers",
  "https://www.centrepointstores.com/ae/en/c/cpmen-footwear-boots",
  "https://www.centrepointstores.com/ae/en/c/cpmen-footwear-formalshoes",
  "https://www.centrepointstores.com/ae/en/c/cpmen-footwear-sandals",
  "https://www.centrepointstores.com/ae/en/c/cpmen-footwear-casualshoes",
  "https://www.centrepointstores.com/ae/en/c/cpmen-footwear-slippersandflipflops",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-sportsshoes",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-sneakers",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-heels",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-flatsandals",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-boots",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-slippersandflipflops",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-casualshoes",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-footwear-ballerinas",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-winterwear",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-dresses",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-bottoms",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-nightwear",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-tops",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-plussizeclothing",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-lingerie",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-sportswearandactivewear",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-arabicclothing",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-ethnicwear",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-sets",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-swimwear",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-jumpsuitsandplaysuits",
  "https://www.centrepointstores.com/ae/en/c/cpwomen-clothing-maternitywear",
  "https://www.centrepointstores.com/ae/en/c/cpkids-clothing-boys",
  "https://www.centrepointstores.com/ae/en/c/cpkids-clothing-girls",
  "https://www.centrepointstores.com/ae/en/c/cpkids-footwear-boys",
  "https://www.centrepointstores.com/ae/en/c/cpkids-footwear-girls",
];

const colors = [
  "black",
  "multicolour",
  "blue",
  "white",
  "pink",
  "gold",
  "beige",
  "green",
  "silver",
  "brown",
  "grey",
  "purple",
  "red",
  "cream",
  "yellow",
  "orange",
  "nude",
  "peach",
  "teal",
  "coral",
  "metallic",
  "clear",
  "copper",
  "transparent",
];

const getGender = (url: string) => {
  if (url.includes("cpmen")) return "male";
  if (url.includes("cpwomen")) return "female";
  if (url.includes("boys")) return "kids/boy";
  if (url.includes("girls")) return "kids/girl";
  return "unisex";
};

const getCategory = (url: string) => {
  if (url.includes("footwear")) return "footwear";
};

(async () => {
  for (let url of pages) {
    for (const color of colors) {
      const colored_url = url + "?q=color.en:" + color;
      logr(`🕷️  Assigned [CENTERPOINT_SPIDER] for ${colored_url}`);
      const start = moment();
      const total = await spider({ url: colored_url, defaultGender: getGender(url), defaultCategory: getCategory(url), defaultColor: color });
      if (total === -3 || total === 0) continue;
      const finish = moment();
      const time = finish.diff(start, "milliseconds");
      logr(`🕷️  [CENTERPOINT_SPIDER] ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
      const timeout = getRandomInteger(30000, 180000);
      log(`🕷️  [CENTERPOINT_SPIDER] ⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
      await new Promise((r) => setTimeout(r, timeout));
    }
  }
})();
