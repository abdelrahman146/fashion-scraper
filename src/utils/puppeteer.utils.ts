import { PuppeteerExtra } from "puppeteer-extra";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { promiseWithRetry } from "./common.utils";
import { Browser, GoToOptions, LaunchOptions, Page } from "puppeteer";

export async function initBrowser(puppeteer: PuppeteerExtra, options: LaunchOptions = {}) {
  return promiseWithRetry(
    async () => {
      const browser = await puppeteer.launch({ headless: "new", ...options });
      return browser;
    },
    {
      failCallback: (_error, retries) => {
        throw new Error(`❗ Failed to launch browser. Attempt: ${retries}. Retrying...`);
      },
    }
  );
}

export async function setupBrowser(): Promise<Browser> {
  puppeteer.use(stealthPlugin());
  const browser = await initBrowser(puppeteer);
  if (browser === -1) {
    throw new Error(`❌ Failed to initialize browser`);
  }
  return browser;
}

export async function navigate(page: Page, url: string, options: GoToOptions = {}) {
  return promiseWithRetry(
    async () => {
      return await page.goto(url, { waitUntil: ["networkidle0", "domcontentloaded"], ...options });
    },
    {
      failCallback: (_error, retries) => {
        console.log({ error: _error });
        // console.log(`❗ Navigation to ${url} failed. Attempt: ${retries}. Retrying...`);
      },
    }
  );
}

export async function closeBrowserOnError(browser: Browser, error?: Error): Promise<void> {
  if (error) {
    console.error(`An error occurred: ${error.message}`);
  }
  try {
    await browser.close();
    console.log("Browser closed successfully.");
  } catch (closeError: any) {
    console.error(`Failed to close browser: ${closeError.message}`);
  }
}
