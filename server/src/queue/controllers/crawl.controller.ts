import { PrismaClient } from "@prisma/client";
import { QSource } from "../type";
import { crawl } from "../../utils/crawl";
import { websiteQueueController } from "./website.controller";
import { closePuppeteer } from "../../utils/puppeteer-fetch";
const prisma = new PrismaClient();

export const crawlQueueController = async (source: QSource) => {
  let maxDepth = source.maxDepth || 1;
  let maxLinks = source.maxLinks || 1;
  const data = await crawl(source.content!, maxDepth, maxLinks, source.usePuppeteerFetch);
  const links = Array.from(data?.links || []);

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

    await websiteQueueController(
      {
        ...newSource,
        embedding: source.embedding,
        chunkOverlap: source.chunkOverlap,
        chunkSize: source.chunkSize,
        usePuppeteerFetch: source.usePuppeteerFetch,
        doNotClosePuppeteer: true,
      },
      prisma
    );

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

  await closePuppeteer()
};
