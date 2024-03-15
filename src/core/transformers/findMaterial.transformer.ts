import { findIntersection } from "../utils/array.utils";

const material = [
  "cotton",
  "polyester",
  "wool",
  "silk",
  "denim",
  "leather",
  "linen",
  "nylon",
  "rayon",
  "spandex",
  "velvet",
  "fleece",
  "chiffon",
  "satin",
  "lace",
  "jersey",
  "flannel",
  "tweed",
  "canvas",
  "mesh",
  "cashmere",
  "acrylic",
  "lining",
  "terry_cloth",
  "elastic",
  "knit",
  "knitted",
  "diving",
  "elasticated",
  "jeans",
  "bamboo",
  "suede",
  "poplin",
  "corduroy",
  "modal",
  "viscose",
  "lyocell",
  "ramie",
  "linsey-woolsey",
  "organza",
  "brocade",
  "velour",
  "batiste",
  "crepe",
  "gabardine",
  "velveteen",
  "taffeta",
  "hemp",
  "tulle",
  "pashmina",
  "batik",
  "seersucker",
  "muslin",
  "calico",
  "oilcloth",
  "gauze",
  "sateen",
  "burlap",
  "pongee",
  "chamois",
  "chinchilla",
  "faille",
  "jute",
  "moleskin",
  "madras",
  "pique",
  "tergal",
  "vicuña",
  "voile",
  "alpaca",
  "angora",
  "boucle",
  "brocatelle",
  "doupioni",
  "georgette",
  "habutai",
  "lame",
  "mohair",
  "panne",
  "peau_de_soine",
  "toile",
  "twill",
  "ultrasuede",
  "worsted",
  "zibeline",
  "chenille",
];

export function findMaterial(text: string, fallbackMaterial?: string): string | null {
  const words = text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/gi, " ")
    .split(" ");
  const int = findIntersection(words, material);
  return int.join("/") || fallbackMaterial || null;
}
