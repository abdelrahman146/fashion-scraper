/*
  Warnings:

  - You are about to drop the column `discountPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "psId" TEXT,
    "source" TEXT,
    "url" TEXT,
    "region" TEXT,
    "title" TEXT,
    "pageOrder" INTEGER,
    "category" TEXT,
    "subCategory" TEXT,
    "brand" TEXT,
    "gender" TEXT,
    "color" TEXT,
    "material" TEXT,
    "priceBeforeDiscount" DECIMAL,
    "sellingPrice" DECIMAL,
    "currency" TEXT DEFAULT 'AED',
    "hasPromotion" BOOLEAN,
    "ratingScore" DECIMAL,
    "ratingCount" INTEGER,
    "otherAttributes" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Product" ("brand", "category", "color", "createdAt", "currency", "description", "gender", "hasPromotion", "id", "material", "otherAttributes", "pageOrder", "psId", "ratingCount", "ratingScore", "region", "source", "subCategory", "title", "url") SELECT "brand", "category", "color", "createdAt", "currency", "description", "gender", "hasPromotion", "id", "material", "otherAttributes", "pageOrder", "psId", "ratingCount", "ratingScore", "region", "source", "subCategory", "title", "url" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
