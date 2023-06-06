import { DoneCallback, Job } from "bull";
import { BotSource } from "@prisma/client";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DialoqbaseVectorStore } from "../utils/store";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const queueHandler = async (job: Job, done: DoneCallback) => {
  const data = job.data as BotSource[];
  try {
    for (const source of data) {
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
          new OpenAIEmbeddings(),
          {
            botId: source.botId,
            sourceId: source.id,
          }
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
          new OpenAIEmbeddings(),
          {
            botId: source.botId,
            sourceId: source.id,
          }
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
    }
  } catch (e) {
    console.log(e);
  }

  done();
};
