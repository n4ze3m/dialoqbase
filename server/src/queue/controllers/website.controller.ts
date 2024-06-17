import { QSource } from "../type";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import * as fs from "fs/promises";
import axios from "axios";
import { DialoqbasePDFLoader } from "../../loader/pdf";
import { DialoqbaseWebLoader } from "../../loader/web";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { PrismaClient } from "@prisma/client";
import { getModelInfo } from "../../utils/get-model-info";

export const websiteQueueController = async (
  source: QSource,
  prisma: PrismaClient
) => {

  let type = "text/html";
  
  try {
    const response = await axios.get(source.content!);
    type = response.headers["content-type"];
  } catch (error) {
    console.error(`[websiteQueueController] Error fetching ${source.content}`);
  }


  if (type.includes("application/pdf")) {
    const response = await axios.get(source.content!, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "binary");

    await fs.writeFile(`./uploads/${source.id}.pdf`, buffer);

    const loader = new DialoqbasePDFLoader(`./uploads/${source.id}.pdf`);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: source.chunkSize,
      chunkOverlap: source.chunkOverlap,
    });
    const chunks = await textSplitter.splitDocuments(docs);

    const embeddingInfo = await getModelInfo({
      model: source.embedding,
      prisma,
      type: "embedding",
    })

    if (!embeddingInfo) {
      throw new Error("Embedding not found. Please verify the embedding id");
    }

    await DialoqbaseVectorStore.fromDocuments(
      chunks,
      embeddings(
        embeddingInfo.model_provider!.toLowerCase(),
        embeddingInfo.model_id,
        embeddingInfo?.config
      ),
      {
        botId: source.botId,
        sourceId: source.id,
      }
    );
  } else {
    let docs: any[] = [];
    if (process.env.USE_LEGACY_WEB_LOADER === "true") {
      const loader = new CheerioWebBaseLoader(source.content!);
      docs = await loader.load();
    } else {
      const loader = new DialoqbaseWebLoader({
        url: source.content!,
        usePuppeteerFetch: source.usePuppeteerFetch,
        doNotClosePuppeteer: source.doNotClosePuppeteer,
      });
      docs = await loader.load();
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(docs);

    const embeddingInfo = await getModelInfo({
      model: source.embedding,
      prisma,
      type: "embedding",
    })

    if (!embeddingInfo) {
      throw new Error("Embedding not found. Please verify the embedding id");
    }

    await DialoqbaseVectorStore.fromDocuments(
      chunks,
      embeddings(
        embeddingInfo.model_provider!.toLowerCase(),
        embeddingInfo.model_id,
        embeddingInfo?.config
      ),
      {
        botId: source.botId,
        sourceId: source.id,
      }
    );
  }
};
