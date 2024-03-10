-- AlterTable
ALTER TABLE "Product" ADD COLUMN "img" TEXT;

-- CreateTable
CREATE TABLE "ProductSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "sellingPrice" DECIMAL,
    "priceBeforeDiscount" DECIMAL,
    "currency" TEXT DEFAULT 'AED',
    "hasPromotion" BOOLEAN,
    "ratingScore" DECIMAL,
    "ratingCount" INTEGER,
    "pageOrder" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
