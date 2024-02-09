export function findGender(text: string, fallback: "male" | "female" | "unisex"): "male" | "female" | "unisex" {
  const lowercaseText = text.toLowerCase();

  // Define keywords for each gender
  const maleKeywords = [
    "men's",
    "men",
    "male",
    "boy",
    "man",
    "gentleman",
    "dude",
    "masculine",
    "groom",
    "father",
    "husband",
    "son",
  ];
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
  ];

  const unisexKeywords = [
    "unisex",
    "gender-neutral",
    "neutral",
    "androgynous",
    "unisex clothing",
    "genderless",
    "inclusive",
  ];

  // Check for male keywords
  if (maleKeywords.some((keyword) => lowercaseText.includes(keyword))) {
    return "male";
  }

  // Check for unisex keywords
  if (unisexKeywords.some((keyword) => lowercaseText.includes(keyword))) {
    return "unisex";
  }

  // If no specific gender keywords are found, return the fallback
  return fallback;
}
