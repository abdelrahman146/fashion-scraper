import { getRandomInteger } from "./number.utils";

type RetryOptions = {
  maxRetries?: number;
  retryDelayRange?: [number, number];
  failCallback?: (error: unknown, retries: number) => void;
};

export async function promiseWithRetry<T>(
  func: () => Promise<T>,
  { maxRetries = 3, retryDelayRange = [3000, 5000], failCallback }: RetryOptions
): Promise<T | -1> {
  let retries = 0;
  while (retries <= maxRetries) {
    try {
      const result: T = await func();
      return result;
    } catch (error) {
      retries++;
      failCallback?.(error, retries);
      const delay = getRandomInteger(retryDelayRange[0], retryDelayRange[1]);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return -1;
}
