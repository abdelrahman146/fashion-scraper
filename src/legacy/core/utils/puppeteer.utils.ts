import puppeteer, { Page } from "puppeteer";
import { EvaluateFunc } from "puppeteer";

type EvalArgs<A> = A[];

export async function evaluateWithRetry<T, A>(page: Page, evaluateCallback: EvaluateFunc<[EvalArgs<A>]>, args: EvalArgs<A>): Promise<T | -1> {
  const maxRetries = 3;
  const retryDelay = 3000;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Attempt to run the callback with page.evaluate
      return (await page.evaluate(evaluateCallback, args)) as T;
    } catch (error: any) {
      retries++;
      // Wait for the specified delay before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  return -1;
}
