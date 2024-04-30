// Path: src/core/Spider.ts
import { GoToOptions, Page, PuppeteerLaunchOptions } from "puppeteer";
import { log, logr } from "./log";
import { getRandomInteger } from "./utils/number.utils";
import moment from "moment";
import { Product, ProductSnapshot, upsertProduct, upsertProductSnapshot } from "./services/products.service";
import { checkIfScraped, registerAsScraped } from "./services/scraped.service";
import { PrismaClient } from "@prisma/client/extension";
import puppeteer from "./providers/puppeteer.provider";
import prisma from "./providers/prisma.provider";
import { PuppeteerExtra } from "puppeteer-extra";
import { categorize } from "./transformers/findCategory.transformer";
import { findColor } from "./transformers/findColor.transformer";
import { findMaterial } from "./transformers/findMaterial.transformer";
import { findGender } from "./transformers/findGender.transformer";
import { promiseWithRetry } from "./utils/common.utils";

export type Data = {
  pid: string;
  title: string;
  image: string;
  brand: string;
  price: {
    sellingPrice: number;
    currency: string;
    priceBeforeDiscount?: number;
  };
  rating?: {
    count: number;
    score: number;
  };
  url: string;
  hasPromotion: boolean;
};

export type Fallbacks = { gender?: string; category?: string; color?: string; material?: string };

export type TransformProps = {
  data: Data[];
  globalAttributes: {
    source: string;
    website: string;
    region: string;
    listingUrl: string;
    currency: string;
  };
  fallbacks?: { gender?: string; category?: string; color?: string; material?: string };
  listingOrderStartFrom: number;
};

export type TransformedProduct = { productInfo: Product; snapshot: Omit<ProductSnapshot, "productId"> };

export abstract class Spider {
  private logSuffix: string;
  protected db: PrismaClient;
  protected puppeteer: PuppeteerExtra;
  private fallbacks: Fallbacks;
  abstract extract(url: string): Promise<number>;
  abstract crawl(): Promise<void>;
  constructor(public source: string) {
    this.logSuffix = `🕷️  [${this.source.toUpperCase()}]:`;
    this.db = prisma;
    this.puppeteer = puppeteer;
    this.fallbacks = {};
  }

  protected setFallbacks(fallbacks: Fallbacks) {
    this.fallbacks = fallbacks;
  }

  protected getFallbacks() {
    return this.fallbacks;
  }

  start(url: string) {
    this.logr(`Spider has been assigned to scrape ${url}`);
    return moment();
  }

  finish(start: moment.Moment, total: number) {
    const finish = moment();
    const time = finish.diff(start, "milliseconds");
    this.logr(` ✅ Succesffully scraped ` + total + " " + moment.duration(time).humanize(true));
  }

  async break(fromMs: number, toMs: number, message = "Taking a break for") {
    const timeout = getRandomInteger(fromMs, toMs);
    this.log(` ⏳ ${message} ${moment.duration(timeout).humanize()} ...`);
    await new Promise((r) => setTimeout(r, timeout));
    this.log(` ⏩ Resuming ...`);
  }

  log(...args: any[]) {
    log(`${this.logSuffix}`, ...args);
  }
  logr(...args: any[]) {
    logr(`${this.logSuffix}`, ...args);
  }

  async checkIfScraped(url: string) {
    return checkIfScraped(url);
  }

  async registerAsScraped(url: string) {
    return registerAsScraped(url);
  }

  transform({ data, globalAttributes, fallbacks, listingOrderStartFrom }: TransformProps): TransformedProduct[] {
    const products: TransformedProduct[] = [];
    let listingOrder = listingOrderStartFrom;
    for (let d of data) {
      const { category, subCategory } = categorize(d.title, fallbacks?.category);
      const product: Product = {
        source: globalAttributes.source,
        website: globalAttributes.website,
        region: globalAttributes.region,
        title: d.title,
        psId: d.pid,
        brand: d.brand,
        url: d.url,
        img: d.image,
        category: category,
        subCategory: subCategory,
        color: findColor(d.title, fallbacks?.color),
        material: findMaterial(d.title, fallbacks?.material),
        gender: findGender(d.title, fallbacks?.gender),
      };
      const productSnapshot: Omit<ProductSnapshot, "productId"> = {
        listingOrder: ++listingOrder,
        listingUrl: globalAttributes.listingUrl,
        ratingCount: d.rating?.count,
        ratingScore: d.rating?.score,
        sellingPrice: d.price.sellingPrice,
        priceBeforeDiscount: d.price.priceBeforeDiscount,
        currency: d.price.currency || globalAttributes.currency,
        hasPromotion: d.hasPromotion,
      };
      products.push({ productInfo: product, snapshot: productSnapshot });
    }
    return products;
  }

  async load(products: TransformedProduct[]): Promise<void> {
    for (let p of products) {
      const product = await upsertProduct(p.productInfo);
      if (product) {
        const snapshot: ProductSnapshot = {
          productId: product.id,
          currency: p.snapshot.currency,
          hasPromotion: p.snapshot.hasPromotion,
          listingOrder: p.snapshot.listingOrder,
          listingUrl: p.snapshot.listingUrl,
          priceBeforeDiscount: p.snapshot.priceBeforeDiscount,
          ratingCount: p.snapshot.ratingCount,
          ratingScore: p.snapshot.ratingScore,
          sellingPrice: p.snapshot.sellingPrice,
        };
        await upsertProductSnapshot(snapshot);
      }
    }
  }

  async navigate(page: Page, url: string, options: GoToOptions = {}) {
    return promiseWithRetry(
      async () => {
        return await page.goto(url, { waitUntil: "networkidle0", ...options });
      },
      {
        failCallback: (_error, retries) => {
          this.log(`❗ Navigation tp ${url} failed. Attempt: ${retries}. Retrying...`);
        },
      }
    );
  }

  async initializeBrowser(options: PuppeteerLaunchOptions = {}) {
    return promiseWithRetry(
      async () => {
        const browser = await this.puppeteer.launch({ headless: "new", ...options });
        const page = await browser.newPage();
        return { page, browser };
      },
      {
        failCallback: (_error, retries) => {
          this.log(`❗ Failed to launch browser. Attempt: ${retries}. Retrying...`);
        },
      }
    );
  }
}
