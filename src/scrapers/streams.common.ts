import { ProductTransformer } from "../transformers/product.transformer";
import { CsvLoader } from "../loaders/csv.loader";
import { Product, SiteConfig } from "../types"; // Assuming type definitions are in 'types.ts'
import { Observable, count, from, map, mergeMap, scan, takeWhile } from "rxjs";

export function extractStream(config: SiteConfig): Observable<Product> {
  return from(config.config.pages).pipe(
    map((page) => ({
      pageData: config.extractor(page.url),
      specs: page.specs,
    })),
    mergeMap((item) => from(item.pageData).pipe(map((products) => ({ products, specs: item.specs })))),
    map((item) => ProductTransformer(config.config.defaultSpecs, item.specs, item.products)),
    mergeMap((products) => from(products))
  );
}

export function loadStream(stream$: Observable<Product>, siteConfig: SiteConfig): Observable<number> {
  const config = siteConfig.config;
  return stream$.pipe(
    scan((acc, product) => ({ count: acc.count + 1, product }), { count: 0, product: {} as Product }),
    takeWhile((acc) => acc.count < config.options.take),
    map((acc) => acc.product),
    CsvLoader(siteConfig.outputFile),
    count()
  );
}
