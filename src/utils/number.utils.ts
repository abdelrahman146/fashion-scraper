export function getRandomInteger(min: number = 0, max: number = 10): number {
  if (min > max) {
    // Swap values if min is greater than max
    [min, max] = [max, min];
  }

  // Generate a random integer between min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
