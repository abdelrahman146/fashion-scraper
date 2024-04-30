import prisma from "../providers/prisma.provider";

export type Product = Parameters<typeof prisma.product.create>[0]["data"];
export type ProductSnapshot = Parameters<typeof prisma.productSnapshot.create>[0]["data"];

/**
 * Upserts a product into the database.
 * If the product already exists, it updates the existing record.
 * If the product does not exist, it creates a new record.
 * @param product The product to upsert.
 * @returns The updated or created product.
 */
export async function upsertProduct(product: Product) {
  if (!product) return;
  if (!product.title || !product.psId) return;

  const productExists = await prisma.product.findFirst({
    where: {
      psId: product.psId,
      source: product.source,
    },
  });

  if (productExists) {
    return prisma.product.update({
      where: {
        id: productExists.id,
      },
      data: product,
    });
  }

  return prisma.product.create({
    data: product,
  });
}

/**
 * Upserts a product snapshot.
 * If a snapshot with the same productId and createdAt in this month already exists, it updates the existing snapshot.
 * Otherwise, it creates a new snapshot.
 * @param snapshot - The product snapshot to upsert.
 * @returns The updated or created product snapshot.
 */
export async function upsertProductSnapshot(snapshot: ProductSnapshot) {
  if (!snapshot) return;
  // find if there is a snapshot with the same productId and createdAt in this month
  const snapshotExists = await prisma.productSnapshot.findFirst({
    where: {
      productId: snapshot.productId,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });
  if (snapshotExists) {
    return prisma.productSnapshot.update({
      where: {
        id: snapshotExists.id,
      },
      data: snapshot,
    });
  }
  return prisma.productSnapshot.create({
    data: snapshot,
  });
}
