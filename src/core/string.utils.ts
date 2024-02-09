export function capitalizeSentence(sentence: string): string {
  if (sentence.length === 0) {
    return sentence;
  }

  const words = sentence.split(" ");

  const capitalizedWords = words.map((word) => {
    return capitalizeFirstLetter(word);
  });

  return capitalizedWords.join(" ");
}

export function capitalizeFirstLetter(inputString: string): string {
  if (inputString.length === 0) {
    return inputString;
  }

  const firstLetter = inputString.charAt(0).toUpperCase();
  const restOfString = inputString.slice(1);

  return firstLetter + restOfString;
}

export function snakeToCamel(inputString: string): string {
  return inputString.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
}

export function camelToSnake(inputString: string): string {
  return inputString.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

const irregularPlurals = {
  child: "children",
  person: "people",
  ox: "oxen",
  jeans: "jeans",
  pants: "pants",
  sneakers: "sneakers",
  loafers: "loafers",
  trousers: "trousers",
  sweatpants: "sweatpants",
  Oxfords: "Oxfords",
  wedges: "wedges",
  straps: "straps",
  boots: "boots",
  heels: "heels",
  flats: "flats",
  panties: "panties",
  slippers: "slippers",
  shoes: "shoes",
  mouse: "mice",
  goose: "geese",
  tooth: "teeth",
  foot: "feet",
  man: "men",
  woman: "women",
  cactus: "cacti",
  focus: "foci",
  fungus: "fungi",
  datum: "data",
  medium: "media",
  crisis: "crises",
  analysis: "analyses",
  ellipsis: "ellipses",
  basis: "bases",
  appendix: "appendices",
  axis: "axes",
  bacterium: "bacteria",
  criterion: "criteria",
  curriculum: "curricula",
  index: "indices",
  phenomenon: "phenomena",
  syllabus: "syllabi",
  die: "dice",
  penny: "pence",
  virus: "viruses",
  deer: "deer",
  moose: "moose",
  sheep: "sheep",
  fish: "fish",
  species: "species",
  aircraft: "aircraft",
  series: "series",
  thesis: "theses",
  hypothesis: "hypotheses",
  potato: "potatoes",
  tomato: "tomatoes",
  hero: "heroes",
  echo: "echoes",
  case: "cases",
  base: "bases",
  name: "names",
};

export function pluralize(word: string): string {
  if (irregularPlurals[word.toLowerCase() as keyof typeof irregularPlurals]) {
    return irregularPlurals[word.toLowerCase() as keyof typeof irregularPlurals];
  } else {
    if (word.match(/s$|x$|z$|sh$|ch$/)) {
      return word + "es";
    } else if (word.match(/y$/)) {
      return word.substring(0, word.length - 1) + "ies";
    } else {
      return word + "s";
    }
  }
}

export function makeSingular(word: string, capitalize?: boolean): string {
  const irregularValues = Object.values(irregularPlurals);
  const irregularKeys = Object.keys(irregularPlurals);
  let singular = "";
  if (irregularValues.includes(word)) {
    singular = irregularKeys[irregularValues.indexOf(word)];
  } else {
    if (word.match(/ies$/)) {
      singular = word.substring(0, word.length - 3) + "y";
    } else if (word.match(/es$/)) {
      singular = word.substring(0, word.length - 2);
    } else if (word.match(/ss$/)) {
      singular = word; // Do nothing if the word ends with 'ss'
    } else if (word.match(/s$/)) {
      singular = word.substring(0, word.length - 1);
    } else {
      singular = word;
    }
  }
  return capitalize ? capitalizeFirstLetter(singular) : singular;
}

export function isPlural(word: string) {
  // Dictionary of excluded words
  const excluded = Object.values(irregularPlurals);

  // Check if the word is in the irregular plurals dictionary
  if (excluded.includes(word)) {
    return word;
  }

  // Define common rules for plural words
  const pluralRules = [
    [/ies$/, "y"], // Replace 'ies' with 'y'
    [/es$/, ""], // Remove 'es'
    [/s$/, ""], // Remove 's'
  ];

  // Check if the word is plural based on the rules
  for (const [pattern, replacement] of pluralRules) {
    if (word.match(pattern)) {
      return word.replace(pattern, replacement as string);
    }
  }

  // If no plural rule matches, return the original word
  return word;
}
