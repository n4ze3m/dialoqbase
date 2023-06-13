import { PrismaClient } from "@prisma/client";
import { QSource } from "../type";
import { crawl } from "../../utils/crawl";
import { websiteQueueController } from "./website.controller";
const prisma = new PrismaClient();

export const crawlQueueController = async (
  source: QSource,
) => {
  let maxDepth = source.maxDepth || 1;
  let maxLinks = source.maxLinks || 1;
  const links = Array.from(
    await crawl(
      source.content!,
      maxDepth,
      0,
      maxLinks,
    ),
  );

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
