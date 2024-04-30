import { DefaultSpecs, ListPageDefaultSpecs, Product, ProductRawData } from "../types";
import cuid from "cuid";

export function ProductTransformer(defaultSpecs: DefaultSpecs, listPageSpecs: ListPageDefaultSpecs, products: ProductRawData[]): Product[] {
  return products.map((product) => {
    return {
      overview: {
        id: cuid(),
        psId: product.pid,
        source: defaultSpecs.source,
        website: defaultSpecs.website,
        url: product.url,
        region: defaultSpecs.region,
        category: listPageSpecs.category,
        subCategory: listPageSpecs.subCategory,
        color: listPageSpecs.color,
        for: listPageSpecs.for,
        title: product.title,
        brand: product.brand,
        img: product.image,
        material: listPageSpecs.material,
        lastUpdated: new Date().toISOString(),
      },
      snapshot: {
        id: cuid(),
        currency: product.price.currency,
        sellingPrice: product.price.sellingPrice,
        priceBeforeDiscount: product.price.priceBeforeDiscount,
        hasPromotion: product.hasPromotion,
        listingOrder: product.listingOrder,
        listingUrl: listPageSpecs.listingUrl,
        capturedAt: new Date().toISOString(),
      },
    };
  });
}
