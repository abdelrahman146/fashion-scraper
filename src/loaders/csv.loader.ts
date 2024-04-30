import * as fs from "fs";
import { tap } from "rxjs/operators";
import * as csv from "fast-csv";
import { Product } from "../types";

export function CsvLoader(output: string) {
  const csvStream = csv.format({ headers: true });
  const writableStream = fs.createWriteStream(output);
  csvStream.pipe(writableStream);
  return tap<Product>({
    next: (data) =>
      csvStream.write({
        psId: data.overview.psId,
        title: data.overview.title,
        brand: data.overview.brand,
        sellingPrice: data.snapshot.sellingPrice,
        priceBeforeDiscount: data.snapshot.priceBeforeDiscount,
        currency: data.snapshot.currency,
        listingOrder: data.snapshot.listingOrder,
        category: data.overview.category,
        subCategory: data.overview.subCategory,
        url: data.overview.website + data.overview.url,
        image: data.overview.img,
      }),
    complete: () => writableStream.end(),
  });
}
