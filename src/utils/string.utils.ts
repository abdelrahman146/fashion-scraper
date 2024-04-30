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

export function like(word1: string, word2: string): boolean {
  // Normalize words by converting to lower case and removing spaces and hyphens
  word1 = word1.toLowerCase().replace(/[- ]/g, "");
  word2 = word2.toLowerCase().replace(/[- ]/g, "");

  // Basic stemmer (handling just some common cases)
  function basicStem(word: string) {
    const suffixes = [
      "ation",
      "ing",
      "ize",
      "iser",
      "ised",
      "ic",
      "ical",
      "est",
      "ment",
      "ness",
      "ship",
      "s",
      "es",
      "ed",
      "er",
      "or",
      "ly",
      "y",
      "al",
      "ive",
      "ize",
      "ise",
      "able",
      "ible",
      "ful",
      "less",
      "ous",
    ];
    for (let suffix of suffixes) {
      if (word.endsWith(suffix)) {
        return word.substring(0, word.length - suffix.length);
      }
    }
    return word;
  }

  word1 = basicStem(word1);
  word2 = basicStem(word2);

  // Levenshtein distance for character-level comparison
  function levenshteinDistance(a: string, b: string) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
    }
    return matrix[b.length][a.length];
  }

  const distance = levenshteinDistance(word1, word2);
  const threshold = Math.floor(Math.max(word1.length, word2.length) * 0.2);

  return distance <= threshold;
}
