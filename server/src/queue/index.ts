import { DoneCallback, Job } from "bull";
import { PrismaClient } from "@prisma/client";
import { QSource } from "./type";
import { pdfQueueController } from "./controllers/pdf.controller";
import { textQueueController } from "./controllers/text.controller";
import { websiteQueueController } from "./controllers/website.controller";
import { crawlQueueController } from "./controllers/crawl.controller";
import { DocxQueueController } from "./controllers/docx.controller";
import { csvQueueController } from "./controllers/csv.controller";

const prisma = new PrismaClient();

export const queueHandler = async (job: Job, done: DoneCallback) => {
  const data = job.data as QSource[];
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
      }
    }
  } catch (e) {
    console.log(e);
  }

  done();
};
