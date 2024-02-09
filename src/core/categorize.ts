import { bag, bottom, footwear, formal, hat, outerwear, set, top, underwear } from "./categories";
import { makeSingular } from "./string.utils";

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

function findIntersection(array1: string[], array2: string[]): string[] {
  // Convert arrays to sets to take advantage of set intersection
  const set1: Set<string> = new Set(array1);
  const set2: Set<string> = new Set(array2);

  // Use the spread operator to convert the intersection set back to an array
  const intersection: string[] = [...new Set([...set1].filter((word) => set2.has(word)))];

  return intersection;
}

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
    .toLowerCase()
    .replace(/t-shirt/gim, "tshirt")
    .replace(/g-string/gim, "gstring")
    .replace(/off-the-shoulder/gim, "offtheshoulder")
    .replace(/button-down/gim, "offtheshoulder")
    .replace(/bell-sleeve/gim, "offtheshoulder")
    .replace(/cold-shoulder/gim, "offtheshoulder")
    .replace(/bell-sleeve/gim, "offtheshoulder")
    .replace(/tie-front/gim, "offtheshoulder")
    .replace(/longs leeve/gim, "longs leeve")
    .replace(/spaghetti strap/gim, "spaghettistrap")
    .replace(/short sleeve/gim, "shortsleeve")
    .replace(/crewneck/gim, "crewneck")
    .replace(/boat neck/gim, "boatneck")
    .replace(/v-neck/gim, "vneck")
    .replace(/pea coat/gim, "peacoat")
    .replace(/trench coat/gim, "trenchcoat")
    .replace(/baseball cap/gim, "baseballcap")
    .replace(/bucket hat/gim, "buckethat")
    .replace(/buckethat/gim, "bucket hat")
    .replace(/bowler hat/gim, "bowlerhat")
    .replace(/sun-hat/gim, "sunhat")
    .replace(/sun hat/gim, "sunhat")
    .replace(/cowboy hat/gim, "cowboyhat")
    .replace(/flat cap/gim, "flatcap")
    .replace(/flat-cap/gim, "flatcap")
    .replace(/panama hat/gim, "panamahat")
    .replace(/trapper hat/gim, "trapperhat")
    .replace(/golf hat/gim, "golfhat")
    .replace(/knit hat/gim, "knithat")
    .replace(/straw hat/gim, "strawhat")
    .replace(/rain hat/gim, "rainhat")
    .replace(/fisherman hat/gim, "fishermanhat")
    .replace(/pillbox hat/gim, "pillboxhat")
    .replace(/flip flop/gim, "flipflop")
    .replace(/flip-flop/gim, "flipflop")
    .replace(/crop top/gim, "croptop")
    .replace(/crop-top/gim, "croptop")
    .replace(/wrap top/gim, "wraptop")
    .replace(/wrap-top/gim, "wrap top")
    .replace(/wide leg/gim, "wideleg")
    .replace(/track suit/gim, "tracksuit")
    .replace(/bottom top/gim, "bottomtop")
    .replace(/bottom-top/gim, "bottomtop")
    .replace(/two-piece/gim, "twopiece")
    .replace(/two piece/gim, "twopiece")
    .replace(/night gown/gim, "nightgown")
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
    .replace(/[^\w\s]/gi, " ")
    .split(" ");

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
  const subCategoryTransformed = [...new Set(subCategory.map((sub) => makeSingular(sub, false)))].join("/");
  if (category === "uncategorized" && defaultCategory) {
    category = defaultCategory;
  }
  return { category, subCategory: subCategoryTransformed };
}
