import { DoneCallback, Job } from "bull";
import { BotSource } from "@prisma/client";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../utils/store";
import { PrismaClient } from "@prisma/client";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { embeddings } from "../utils/embeddings";

const prisma = new PrismaClient();

interface QSource extends BotSource {
  embedding: string;
}

export const queueHandler = async (job: Job, done: DoneCallback) => {
  const data = job.data as QSource[];

  for (const source of data) {
    try {
      if (source.type.toLowerCase() === "website") {
        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "PROCESSING",
          },
        });

        const loader = new CheerioWebBaseLoader(source.content!);
        const docs = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitDocuments(docs);

        await DialoqbaseVectorStore.fromDocuments(
          chunks,
          embeddings(source.embedding),
          {
            botId: source.botId,
            sourceId: source.id,
          },
        );

        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "FINISHED",
            isPending: false,
          },
        });
      } else if (source.type.toLowerCase() === "text") {
        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "PROCESSING",
          },
        });

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitDocuments([
          {
            pageContent: source.content!,
            metadata: {
              source: `text-${source.id}`,
            },
          },
        ]);

        await DialoqbaseVectorStore.fromDocuments(
          chunks,
          embeddings(source.embedding),
          {
            botId: source.botId,
            sourceId: source.id,
          },
        );

        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "FINISHED",
            isPending: false,
          },
        });
      } else if (source.type.toLowerCase() === "pdf") {
        console.log("loading pdf");
        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "PROCESSING",
          },
        });

        const location = source.location!;
        const loader = new PDFLoader(location);
        const docs = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitDocuments(docs);

        await DialoqbaseVectorStore.fromDocuments(
          chunks,
          embeddings(source.embedding),
          {
            botId: source.botId,
            sourceId: source.id,
          },
        );

        await prisma.botSource.update({
          where: {
            id: source.id,
          },
          data: {
            status: "FINISHED",
            isPending: false,
          },
        });
      }
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

  done();
};
