import { Browser } from "puppeteer";
import { Observable } from "rxjs";

export interface ScraperConfig {
  pages: { url: string; specs: ListPageDefaultSpecs }[];
  defaultSpecs: DefaultSpecs;
  options: {
    take: number;
  };
}

export type Extractor = (url: string) => Observable<ProductRawData[]>;
export type Filter = (stream$: Observable<Product>) => Observable<Product>;

export interface SiteConfig {
  siteName: string;
  config: ScraperConfig;
  extractor: Extractor;
  outputFile: string;
  filtersStream?: Filter;
}

export type ProductRawData = {
  pid: string;
  title: string;
  image: string;
  brand: string;
  listingOrder: number;
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

export interface DefaultSpecs {
  source: string;
  website: string;
  region: string;
  currency: string;
}

export interface ListPageDefaultSpecs {
  listingUrl: string;
  for: string;
  category: string;
  subCategory: string;
  color?: string;
  material?: string;
}

export interface ProductOverview {
  id: string;
  psId: string; // product source id
  source: string;
  website: string;
  img: string;
  imgs?: string[];
  url: string;
  region: string;
  title: string;
  brand: string;
  for: string; // men women kids
  lastUpdated: string;
  subCategory: string;
  color?: string;
  description?: string;
  category: string;
  material?: string;
  occasion?: string;
}

export interface ProductSnapshot {
  id: string;
  sellingPrice: number;
  priceBeforeDiscount?: number;
  currency: string;
  hasPromotion: boolean;
  ratingScore?: number;
  ratingCount?: number;
  listingUrl: string;
  listingOrder: number;
  capturedAt: string;
}

export interface Product {
  overview: ProductOverview;
  snapshot: ProductSnapshot;
}
