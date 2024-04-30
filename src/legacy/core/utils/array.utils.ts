import { like } from "./string.utils";

export function findIntersection(array1: string[], array2: string[]): string[] {
  // Convert arrays to sets to take advantage of set intersection
  const set1: Set<string> = new Set(array1);
  const set2: Set<string> = new Set(array2);

  const intersection: string[] = [];
  for (let element of set1) {
    for (let element2 of set2) {
      if (like(element, element2)) {
        intersection.push(element2);
      }
    }
  }

  return [...new Set(intersection)];
}
