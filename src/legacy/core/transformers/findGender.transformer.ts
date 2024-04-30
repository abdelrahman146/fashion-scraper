import { like } from "../utils/string.utils";

export function findGender(text: string, fallback?: string): string | undefined {
  const words = text.toLowerCase().split(" ");

  // Define keywords for each gender
  const maleKeywords = ["men's", "men", "male", "boy", "man", "gentleman", "dude", "masculine", "groom", "father", "husband", "son", "brother"];
  const femaleKeywords = [
    "women's",
    "women",
    "dress",
    "skirt",
    "bra",
    "female",
    "girl",
    "woman",
    "feminine",
    "lady",
    "queen",
    "bride",
    "mother",
    "wife",
    "daughter",
    "blouse",
    "lingerie",
    "heels",
    "handbag",
    "earrings",
    "makeup",
    "gown",
    "panties",
    "thong",
    "briefs",
    "boyshorts",
    "underwear",
    "knickers",
    "nightgown",
    "nightdress",
  ];

  const unisexKeywords = ["unisex", "gender-neutral", "neutral", "androgynous", "unisex clothing", "genderless", "inclusive"];
  let intersection = [];
  for (let element of maleKeywords) {
    for (let element2 of words) {
      if (like(element, element2)) {
        intersection.push(element2);
      }
    }
  }
  if (intersection.length > 0) {
    return "men";
  }

  intersection = [];
  for (let element of femaleKeywords) {
    for (let element2 of words) {
      if (like(element, element2)) {
        intersection.push(element2);
      }
    }
  }
  if (intersection.length > 0) {
    return "women";
  }

  intersection = [];
  for (let element of unisexKeywords) {
    for (let element2 of words) {
      if (like(element, element2)) {
        intersection.push(element2);
      }
    }
  }
  if (intersection.length > 0) {
    return "unisex";
  }

  // If no specific gender keywords are found, return the fallback
  return fallback;
}
