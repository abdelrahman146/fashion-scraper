import { log, logr } from "../../../core/log";
import { getRandomInteger } from "../../../core/number.utils";
import { spider } from "./spider";
import moment from "moment";

const pages = [
  "https://en-ae.6thstreet.com/women/clothing.html?q=Women+Clothing&idx=enterprise_magento_english&p=0&hFR[categories.level0][0]=Women+%2F%2F%2F+Clothing&nR[visibility_catalog][=][0]=1&dFR[in_stock][0]=1",
  "https://en-ae.6thstreet.com/women/shoes.html?q=Women+Shoes&idx=enterprise_magento_english&p=0&hFR[categories.level0][0]=Women+%2F%2F%2F+Shoes&nR[visibility_catalog][=][0]=1&dFR[in_stock][0]=1",
  "https://en-ae.6thstreet.com/men/clothing.html?q=Men+Clothing&idx=enterprise_magento_english&p=0&hFR[categories.level0][0]=Men+%2F%2F%2F+Clothing&nR[visibility_catalog][=][0]=1&dFR[in_stock][0]=1",
  "https://en-ae.6thstreet.com/men/shoes.html?q=Men+Shoes&idx=enterprise_magento_english&p=0&hFR[categories.level0][0]=Men+%2F%2F%2F+Shoes&nR[visibility_catalog][=][0]=1&dFR[in_stock][0]=1",
  "https://en-ae.6thstreet.com/kids/clothing.html?q=Kids+Clothing&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Kids+%2F%2F%2F+Clothing&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bgender%5D%5B0%5D=Boy&dFR%5Bin_stock%5D%5B0%5D=1",
  "https://en-ae.6thstreet.com/kids/clothing.html?q=Kids+Clothing&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Kids+%2F%2F%2F+Clothing&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bgender%5D%5B0%5D=Girl&dFR%5Bin_stock%5D%5B0%5D=1",
  "https://en-ae.6thstreet.com/kids/footwear.html?q=Kids+Footwear&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Kids+%2F%2F%2F+Footwear&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bgender%5D%5B0%5D=Boy&dFR%5Bin_stock%5D%5B0%5D=1",
  "https://en-ae.6thstreet.com/kids/footwear.html?q=Kids+Footwear&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Kids+%2F%2F%2F+Footwear&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bgender%5D%5B0%5D=Girl&dFR%5Bin_stock%5D%5B0%5D=1",
];

const colors = [
  "Almond",
  "Beige",
  "Black",
  "Blue",
  "Blush",
  "Bronze",
  "Brown",
  "Burgundy",
  "Camel",
  "Caramel",
  "Clear",
  "Coral",
  "Cream",
  "Fuchsia",
  "Gold",
  "Gray",
  "Green",
  "Grey",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "Lilac",
  "Lime",
  "Magenta",
  "Maroon",
  "Mauve",
  "Metallic",
  "Mint",
  "Multi",
  "Multicolour",
  "Mustard",
  "Natural",
  "Navy",
  "NavyBlue",
  "Neon",
  "Neutral",
  "Nude",
  "OffWhite",
  "Olive",
  "Orange",
  "Peach",
  "Pink",
  "Plum",
  "Purple",
  "Red",
  "Rose",
  "RoseGold",
  "Silver",
  "Tan",
  "Taupe",
  "Teal",
  "Turquoise",
  "Violet",
  "White",
  "Wine",
  "Yellow",
];

const getGender = (url: string) => {
  if (url.includes("women")) return "female";
  if (url.includes("men")) return "male";
  if (url.includes("boy")) return "kids/boy";
  if (url.includes("girl")) return "kids/girl";
  return "unisex";
};

const getCategory = (url: string) => {
  if (url.includes("footwear")) return "footwear";
};

(async () => {
  for (let url of pages) {
    for (const color of colors) {
      const colored_url = url + "&dFR[colorfamily][0]=" + color;
      logr(`🕷️  Assigned [6THSTREET_SPIDER] for ${colored_url}`);
      const start = moment();
      const total = await spider({ url: colored_url, defaultGender: getGender(url), defaultCategory: getCategory(url), defaultColor: color });
      if (total === -3 || total === -1 || total === 0) continue;
      const finish = moment();
      const time = finish.diff(start, "milliseconds");
      logr(`🕷️  [6THSTREET_SPIDER] ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
      const timeout = getRandomInteger(30000, 180000);
      log(`🕷️  [6THSTREET_SPIDER] ⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
      await new Promise((r) => setTimeout(r, timeout));
    }
  }
})();
