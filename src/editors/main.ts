import { PrismaClient } from "@prisma/client";
import { categorize } from "../core/transformers/findCategory.transformer";
import { findColor } from "../core/transformers/findColor.transformer";
import { findMaterial } from "../core/transformers/findMaterial.transformer";
import { log } from "../core/log";

const prisma = new PrismaClient();

const take = 100;

(async () => {
  const total = await prisma.product.count({
    where: {
      category: "uncategorized",
    },
  });
  const batches = Math.floor(total / take);
  for (let i = 0; i <= batches; i++) {
    const batch = await prisma.product.findMany({
      where: {
        category: "uncategorized",
      },
      select: {
        id: true,
        title: true,
        material: true,
        color: true,
      },
      take: take,
      skip: take * i,
    });
    for (let { title, id, material, color } of batch) {
      const { category, subCategory } = categorize(title || "");
      if (!color) color = findColor(title || "");
      if (!material) material = findMaterial(title || "");
      const { id: pid } = await prisma.product.update({
        where: {
          id,
        },
        data: {
          category,
          subCategory,
          color,
          material,
        },
        select: {
          id: true,
        },
      });
      if (Math.random() > 0.99 && category == "uncategorized") {
        console.log("product", pid, title, { category, subCategory });
      }
    }
    // log("✔️  Completed " + (i + 1) + "/" + (batches + 1));
  }
})();
