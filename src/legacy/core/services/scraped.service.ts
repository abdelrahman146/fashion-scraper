import prisma from "../providers/prisma.provider";

/**
 * Checks if a URL has been scraped.
 * @param url - The URL to check.
 * @returns A promise that resolves to a boolean indicating whether the URL has been scraped.
 */
export async function checkIfScraped(url: string): Promise<boolean> {
  const scraped_url = await prisma.scraped.findFirst({
    where: {
      url,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });
  return !!scraped_url;
}

/**
 * Registers a URL as scraped.
 * @param url - The URL to register as scraped.
 * @returns A promise that resolves to the created scraped entity.
 */
export async function registerAsScraped(url: string) {
  return prisma.scraped.create({
    data: {
      url,
    },
  });
}
