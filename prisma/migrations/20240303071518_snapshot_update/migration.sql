/*
  Warnings:

  - You are about to drop the column `pageOrder` on the `ProductSnapshot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "website" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellingPrice" DECIMAL,
    "priceBeforeDiscount" DECIMAL,
    "currency" TEXT DEFAULT 'AED',
    "hasPromotion" BOOLEAN,
    "ratingScore" DECIMAL,
    "ratingCount" INTEGER,
    "listingUrl" TEXT,
    "listingOrder" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    CONSTRAINT "ProductSnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductSnapshot" ("createdAt", "currency", "hasPromotion", "id", "priceBeforeDiscount", "productId", "ratingCount", "ratingScore", "sellingPrice") SELECT "createdAt", "currency", "hasPromotion", "id", "priceBeforeDiscount", "productId", "ratingCount", "ratingScore", "sellingPrice" FROM "ProductSnapshot";
DROP TABLE "ProductSnapshot";
ALTER TABLE "new_ProductSnapshot" RENAME TO "ProductSnapshot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
