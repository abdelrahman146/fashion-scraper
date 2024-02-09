export function findIntersection(array1: string[], array2: string[]): string[] {
  // Convert arrays to sets to take advantage of set intersection
  const set1: Set<string> = new Set(array1);
  const set2: Set<string> = new Set(array2);

  // Use the spread operator to convert the intersection set back to an array
  const intersection: string[] = [...new Set([...set1].filter((word) => set2.has(word)))];

  return intersection;
}
