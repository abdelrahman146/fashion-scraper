export interface Url {
  url: string;
  category: string;
  subCategory: string;
  gender: string;
  color?: string;
  material?: string;
}

export interface Source {
  region: string;
  spider: string;
  language: string;
  urls: Url[];
}

export interface LocalOutput {
  type: "local";
  path: string;
  format: "json" | "csv";
}

export interface DatabaseOutput {
  type: "database";
  db: "mongo" | "mysql" | "postgres" | "sqlite";
  connection: string;
}

export type Output = LocalOutput | DatabaseOutput;

export interface Config {
  src: Source | Source[];
  output: Output | Output[];
}

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

export interface DefaultSpecs {
  source: string;
  website: string;
  region: string;
  currency: string;
}

export interface UrlDefaultSpecs {
  listingUrl: string;
  gender: string;
  category: string;
  color?: string;
  material?: string;
}

export interface TransformProps {
  data: Data[];
  defaultSpecs: DefaultSpecs & UrlDefaultSpecs;
  listingOrderStartFrom: number;
}

interface Product {
  id: string;
  psId: string; // product source id
  source: string;
  website: string;
  img: string;
  imgs?: string[];
  url: string;
  region: string;
  title: string;
  category: string | string[];
  subCategory: string | string[];
  brand?: string;
  gender?: string;
  color?: string;
  material?: string;
  description?: string;
  lastUpdated: string;
}

interface ProductSnapshot {
  id: string;
  sellingPrice?: number;
  priceBeforeDiscount?: number;
  currency?: string;
  hasPromotion?: boolean;
  ratingScore?: number;
  ratingCount?: number;
  listingUrl?: string;
  listingOrder?: number;
  capturedAt: string;
}

export interface TransformedProduct {
  product: Product;
  snapshot: ProductSnapshot;
}

export type ExtractFn = (url: string) => Promise<Data[]>;
export type TransfomFn = (props: TransformProps) => TransformedProduct[];
export type LoadFn = (products: TransformedProduct[]) => Promise<void>;

export interface CreateSpiderProps {
  extract: ExtractFn;
  transform: TransfomFn;
  load: LoadFn;
}
