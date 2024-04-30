import { filter } from "rxjs";
import { Filter } from "../../types";

export const sixthStreetFilter: Filter = (stream$) =>
  stream$.pipe(
    filter((product) => {
      const brand = product.overview.brand.toLowerCase();
      return !(brand === "trendyol" || brand === "boohoo" || brand.includes("stanbul") || brand.includes("stili"));
    }),
    filter((product) => product.snapshot.sellingPrice <= 140),
    filter((product) => {
      const title = product.overview.title.toLowerCase();
      return !(
        title.includes("one shoulder") ||
        title.includes("off shoulder") ||
        title.includes("short sleeves") ||
        title.includes("strappy") ||
        title.includes("singlet")
      );
    })
  );

export const namshiFilter: Filter = (stream$) => stream$.pipe(filter((product) => product.snapshot.sellingPrice <= 140));
