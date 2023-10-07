import { PrismaClient } from "@prisma/client";
import { QSource } from "../type";
import { websiteQueueController } from "./website.controller";
const prisma = new PrismaClient();
import Sitemapper from "sitemapper";

export const sitemapQueueController = async (
  source: QSource,
) => {
  const url = source.content!;

  const sitemapper = new Sitemapper({
    url,
    timeout: 300000,
    concurrency: process.env.SITEMAPPER_CONCURRENCY
      ? parseInt(process.env.SITEMAPPER_CONCURRENCY)
      : 2,
    retries: process.env.SITEMAPPER_MAX_RETRIES
      ? parseInt(process.env.SITEMAPPER_MAX_RETRIES)
      : 1,
    requestHeaders: {
      "User-Agent": process.env.SITEMAPPER_USER_AGENT ||
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0'",
    },
  });

  const data = await sitemapper.fetch();

  if (data.errors.length > 0) {
    console.log(data.errors);
    throw new Error("Sitemapper failed to fetch sitemap");
  }

  const links = data.sites;

  for (const link of links) {
    const newSource = await prisma.botSource.create({
      data: {
        botId: source.botId,
        content: link,
        isPending: true,
        status: "PENDING",
        type: "website",
      },
    });

    await websiteQueueController({
      ...newSource,
      embedding: source.embedding,
    });

    await prisma.botSource.update({
      where: {
        id: newSource.id,
      },
      data: {
        status: "FINISHED",
        isPending: false,
      },
    });
  }
};
