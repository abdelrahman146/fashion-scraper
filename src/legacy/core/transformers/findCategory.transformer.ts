import { bag, bottom, footwear, formal, hat, outerwear, set, top, underwear } from "../utils/categories.utils";
import { findIntersection } from "../utils/array.utils";

type FindLongestArrayProps = {
  set: string[];
  bottom: string[];
  top: string[];
  bag: string[];
  hat: string[];
  footwear: string[];
  outerwear: string[];
  underwear: string[];
  formalwear: string[];
};

function findMatchCategory(categories: FindLongestArrayProps): [string, string[]] {
  const entries = Object.entries(categories);
  let match: [string, string[]] = entries[0];

  for (const entry of entries) {
    if (entry[1].length > match[1].length) {
      match = entry;
    }
  }
  if (match[1].length === 0) return ["uncategorized", ["uncategorized"]];
  return match;
}

export function categorize(text: string, defaultCategory?: string): { category: string; subCategory: string } {
  const words = text
    .trim()
    .replace(/long sleeve/gim, "longsleeves")
    .replace(/spaghetti strap/gim, "spaghettistrap")
    .replace(/short sleeve/gim, "shortsleeve")
    .replace(/boat neck/gim, "boatneck")
    .replace(/pea coat/gim, "peacoat")
    .replace(/trench coat/gim, "trenchcoat")
    .replace(/baseball cap/gim, "baseballcap")
    .replace(/bucket hat/gim, "buckethat")
    .replace(/buckethat/gim, "bucket hat")
    .replace(/bowler hat/gim, "bowlerhat")
    .replace(/sun hat/gim, "sunhat")
    .replace(/cowboy hat/gim, "cowboyhat")
    .replace(/flat cap/gim, "flatcap")
    .replace(/panama hat/gim, "panamahat")
    .replace(/trapper hat/gim, "trapperhat")
    .replace(/golf hat/gim, "golfhat")
    .replace(/knit hat/gim, "knithat")
    .replace(/straw hat/gim, "strawhat")
    .replace(/rain hat/gim, "rainhat")
    .replace(/fisherman hat/gim, "fishermanhat")
    .replace(/pillbox hat/gim, "pillboxhat")
    .replace(/flip flop/gim, "flipflop")
    .replace(/crop top/gim, "croptop")
    .replace(/crop-top/gim, "croptop")
    .replace(/wrap top/gim, "wraptop")
    .replace(/wide leg/gim, "wideleg")
    .replace(/track suit/gim, "tracksuit")
    .replace(/bottom top/gim, "bottomtop")
    .replace(/bottom-top/gim, "bottomtop")
    .replace(/two-piece/gim, "twopiece")
    .replace(/two piece/gim, "twopiece")
    .replace(/high waist/gim, "highwaist")
    .replace(/high waist/gim, "highwaist")
    .replace(/low rise/gim, "lowrise")
    .replace(/carpenter pants/gim, "carpenterpants")
    .replace(/sailor pants/gim, "sailorpants")
    .replace(/mary janes/gim, "maryjanes")
    .replace(/wellyboots/gim, "welly boots")
    .replace(/chelsea boots/gim, "chelseaboots")
    .replace(/combat boots/gim, "combatboots")
    .replace(/hiking boots/gim, "hikingboots")
    .replace(/rain boots/gim, "rainboots")
    .replace(/ankle boots/gim, "ankleboots")
    .replace(/thigh high/gim, "thighhigh")
    .replace(/tap shorts/gim, "tapshorts")
    .replace(/bow tie/gim, "bowtie")
    .replace(/hand bag/gim, "handbag")
    .replace(/yoga pants/gim, "yogapants")
    .replace(/night-gown/gim, "nightgown")
    .replace(/body suit/gim, "bodysuit")
    .replace(/body-suit/gim, "bodysuit")
    .replace(/2-piece/gim, "twopiece")
    .replace(/2 piece/gim, "twopiece")
    .replace(/2piece/gim, "twopiece")
    .replace(/panty hose/gim, "pantyhose")
    .replace(/winter jacket/gim, "winterjacket")
    .replace(/capri suit/gim, "capri")
    .replace(/cropped top/gim, "croptop")
    .replace(/prayer dress/gim, "prayerdress")
    .replace(/swimwear/gim, "swimsuit")
    .replace(/sweats\b/gim, "sweatshirt")
    .replace(/play suite/gim, "playsuit")
    .replace(/hoodies/gim, "hoodie")
    .replace(/tee\b/gim, "tshirt")
    .replace(/tees\b/gim, "tshirt")
    .replace(/[^\w\s]/gi, " ")
    .split(" ");

  if (words.includes("shirt") || words.includes("shirts")) {
    return { category: "top", subCategory: "shirt" };
  }
  if (words.includes("tshirt") || words.includes("t-shirt")) {
    return { category: "top", subCategory: "tshirt" };
  }
  if (words.includes("short") || words.includes("shorts")) {
    return { category: "bottom", subCategory: "short" };
  }

  let [category, subCategory] = findMatchCategory({
    set: findIntersection(words, set),
    footwear: findIntersection(words, footwear),
    underwear: findIntersection(words, underwear),
    formalwear: findIntersection(words, formal),
    outerwear: findIntersection(words, outerwear),
    top: findIntersection(words, top),
    bottom: findIntersection(words, bottom),
    bag: findIntersection(words, bag),
    hat: findIntersection(words, hat),
  });

  const subCategoryTransformed = [...new Set(subCategory)].join("/");
  if (category === "uncategorized" && defaultCategory) {
    category = defaultCategory;
  }

  if (words.includes("set")) {
    category = "set";
  }

  return { category, subCategory: subCategoryTransformed };
}
