import { log, logr } from "../../../core/log";
import { getRandomInteger } from "../../../core/number.utils";
import { spider } from "./spider";
import moment from "moment";

const clothing = [
  { url: "https://www.sivvi.com/uae-en/men/mens-clothing", gender: "male" },
  { url: "https://www.sivvi.com/uae-en/women/womens-clothing", gender: "female" },
  { url: "https://www.sivvi.com/uae-en/kids/boys/boys-clothing", gender: "kids/boy" },
  { url: "https://www.sivvi.com/uae-en/kids/girls/girls-clothing", gender: "kids/girl" },
];

const others = [
  { url: "https://www.sivvi.com/uae-en/kids/boys/boys-shoes", gender: "kids/boy", category: "footwear" },
  { url: "https://www.sivvi.com/uae-en/kids/girls/girls-shoes", gender: "kids/girl", category: "footwear" },
  { url: "https://www.sivvi.com/uae-en/men/mens-shoes", gender: "male", category: "footwear" },
  { url: "https://www.sivvi.com/uae-en/women/womens-bags", gender: "female", category: "bag" },
];

function genUrl(url: string, color: string, material?: string) {
  const query = "?f[material]={material}&f[colour_family]={color}";
  if (!material) {
    return url + query.replace("f[material]={material}&", "").replace("{color}", color);
  }
  return url + query.replace("{material}", material).replace("{color}", color);
}

const colors = [
  "beige",
  "black",
  "blue",
  "brown",
  "green",
  "grey",
  "multicolour",
  "orange",
  "pink",
  "purple",
  "red",
  "silver",
  "gold",
  "white",
  "yellow",
];

const materials = [
  "Velvet",
  "acrylic",
  "acrylic_blend",
  "bamboo",
  "canvas",
  "cashmere",
  "cashmere_blend",
  "chiffon",
  "combination",
  "cotton",
  "cotton_blend",
  "cotton_polyester",
  "crepe",
  "dacron",
  "denim",
  "elastane",
  "elastane_blend",
  "fabric",
  "flannel",
  "georgette",
  "jacquard",
  "jersey",
  "jute",
  "lace",
  "leather",
  "linen",
  "linen_blend",
  "lycra",
  "lyocell",
  "mesh",
  "metal",
  "microfibre",
  "modal",
  "modal_blend",
  "net",
  "nylon",
  "nylon_blend",
  "poly_crepe",
  "polyamide",
  "polyamide_blend",
  "polyester",
  "polyester_blend",
  "polyester_pu",
  "polyester_spandex",
  "polysatin",
  "polyster_blend",
  "polyurethane",
  "pu",
  "pvc",
  "ramie",
  "rayon",
  "rayon_blend",
  "satin",
  "sequin",
  "silk",
  "silk_blend",
  "silk_satin",
  "spandex",
  "suede_leather",
  "synthetic",
  "tencel",
  "textile",
  "tulle",
  "velvet",
  "viscose",
  "viscose_blend",
  "wool",
  "wool_blend",
];

(async () => {
  for (let { url, gender } of clothing) {
    for (const color of colors) {
      for (const material of materials) {
        const custom_url = genUrl(url, color, material);
        logr(`🕷️  Assigned [SIVVI_SPIDER] for ${custom_url}`);
        const start = moment();
        const total = await spider({ url: custom_url, defaultGender: gender, defaultMaterial: material, defaultColor: color });
        if (total === -3 || total === 0) continue;
        const finish = moment();
        const time = finish.diff(start, "milliseconds");
        logr(`🕷️  [SIVVI_SPIDER] ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
        const timeout = getRandomInteger(30000, 180000);
        log(`🕷️  [SIVVI_SPIDER] ⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
        await new Promise((r) => setTimeout(r, timeout));
      }
    }
  }
  for (let { url, gender, category } of others) {
    for (const color of colors) {
      const custom_url = genUrl(url, color);
      logr(`🕷️  Assigned [SIVVI_SPIDER] for ${custom_url}`);
      const start = moment();
      const total = await spider({ url: custom_url, defaultGender: gender, defaultCategory: category, defaultColor: color });
      if (total === -3) continue;
      const finish = moment();
      const time = finish.diff(start, "milliseconds");
      logr(`🕷️  [SIVVI_SPIDER] ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
      const timeout = getRandomInteger(30000, 180000);
      log(`🕷️  [SIVVI_SPIDER] ⏳ Taking a break for ${moment.duration(timeout).humanize()} ...`);
      await new Promise((r) => setTimeout(r, timeout));
    }
  }
})();
