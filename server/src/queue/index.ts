import { DoneCallback, Job } from "bull";
import { PrismaClient } from "@prisma/client";
import { QSource } from "./type";
import { pdfQueueController } from "./controllers/pdf.controller";
import { textQueueController } from "./controllers/text.controller";
import { websiteQueueController } from "./controllers/website.controller";
import { crawlQueueController } from "./controllers/crawl.controller";
import { DocxQueueController } from "./controllers/docx.controller";
import { csvQueueController } from "./controllers/csv.controller";
import { githubQueueController } from "./controllers/github.controller";
import { txtQueueController } from "./controllers/txt.controller";
import { audioQueueController } from "./controllers/audio.controller";
import { videoQueueController } from "./controllers/video.controller";
import { youtubeQueueController } from "./controllers/youtube.controller";
import { restQueueController } from "./controllers/rest.controller";
import { sitemapQueueController } from "./controllers/sitemap.controller";

const prisma = new PrismaClient();

export default async function queueHandler(job: Job, done: DoneCallback) {
  const data = job.data as QSource[];
  await prisma.$connect();
  console.log("Processing queue");
  try {
    for (const source of data) {
      try {
        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "PROCESSING",
          },
        });
        switch (source.type.toLowerCase()) {
          case "website":
            await websiteQueueController(
              source,
            );
            break;
          case "text":
            await textQueueController(
              source,
            );
            break;
          case "pdf":
            await pdfQueueController(
              source,
            );
            break;
          case "crawl":
            await crawlQueueController(
              source,
            );
            break;

          case "docx":
            await DocxQueueController(
              source,
            );
            break;

          case "csv":
            await csvQueueController(
              source,
            );
            break;
          case "github":
            await githubQueueController(
              source,
            );
            break;
          case "txt":
            await txtQueueController(
              source,
            );
            break;
          case "mp3":
            await audioQueueController(
              source,
            );
            break;
          case "mp4":
            await videoQueueController(
              source,
            );
            break;
          case "youtube":
            await youtubeQueueController(
              source,
            );
            break;
          case "rest":
            await restQueueController(source);
            break;
          case "sitemap":
            await sitemapQueueController(source);
            break;
          default:
            break;
        }

        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "FINISHED",
            isPending: false,
          },
        });

        done();
        await prisma.$disconnect();
      } catch (e) {
        console.log(e);
        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "FAILED",
            isPending: false,
          },
        });
        await prisma.$disconnect();
        done();
      }
    }
  } catch (e) {
    console.log(e);
  }
}
