import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
import { getRandomInteger } from "./src/core/utils/number.utils";

// get 10 random rows from products table and make sure that title / category / sub category / color / material / price / price before discount are not null
export const get5RandomProducts = async () => {
  const totalProducts = await prisma.product.count();
  let index = getRandomInteger(1, totalProducts - 1);
  const product = await prisma.product.findFirstOrThrow();
  const products: (typeof product)[] = [];
  const sources = ["sivvi", "brandsforless", "6thstreet", "max", "centerpoint", "trendyol", "namshi"];
  for (const source of sources) {
    const selections = await prisma.product.findMany({
      where: {
        id: { notIn: products.map((p) => p.id) },
        source: { equals: source },
        title: { not: null },
        // ratingCount: { not: null },
        // ratingScore: { not: null },
        gender: { not: null },
        hasPromotion: { not: null },
        currency: { not: null },
        category: { not: null },
        subCategory: { not: null },
        color: { not: null },
        material: { not: null },
        priceBeforeDiscount: { not: null },
        sellingPrice: { not: null },
      },
      take: 100,
    });
    if (selections.length) {
      products.push(selections[getRandomInteger(0, selections.length - 1)]);
    }
  }
  return products;
};

(async () => {
  const products = await get5RandomProducts();
  // Convert products to HTML table
  const tableRows = products.map((product) => {
    return `
            <tr>
                <td>${product.source}</td>
                <td><a href="https://${product.source}.com${product.url}">${
      product.url!.length > 50 ? product.url!.slice(0, 50) + "..." : product.url
    }</></td>
                <td>${product.region}</td>
                <td>${product.title!.length > 50 ? product.title!.slice(0, 50) + "..." : product.title}</td>
                <td>${product.pageOrder}</td>
                <td>${product.brand}</td>
                <td>${product.category}</td>
                <td>${product.subCategory}</td>
                <td>${product.gender}</td>
                <td>${product.color}</td>
                <td>${product.material}</td>
                <td>${product.priceBeforeDiscount?.toFixed(2)}</td>
                <td>${product.sellingPrice?.toFixed(2)}</td>
                <td>${product.currency}</td>
                <td>${product.hasPromotion}</td>
                
            </tr>
        `;
  });

  const htmlTable = `
        <table>
            <thead>
                <tr>
                    <th>Source Website</th>
                    <th>Product URL</th>
                    <th>Region</th>
                    <th>Title</th>
                    <th>Order in the page</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Gender</th>
                    <th>Color</th>
                    <th>Material</th>
                    <th>Price Before Discount</th>
                    <th>Selling Price</th>
                    <th>Currency</th>
                    <th>Has Promotion</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows.join("")}
            </tbody>
        </table>
    `;
  fs.writeFile("table.html", htmlTable, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("HTML table saved to table.html");
  });
})();
