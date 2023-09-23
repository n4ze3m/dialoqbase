import { QSource } from "../type";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import * as fs from "fs/promises";
import axios from "axios";
import { DialoqbasePDFLoader } from "../../loader/pdf";

export const websiteQueueController = async (
  source: QSource,
) => {
  // check if url is html or pdf or other
  // if html, use cheerio

  const response = await axios.get(source.content!);

  const type = response.headers["content-type"];

  console.log("website type is", type);

  if (type.includes("application/pdf")) {
    const response = await axios.get(source.content!, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "binary");

    await fs.writeFile(`./uploads/${source.id}.pdf`, buffer);

    const loader = new DialoqbasePDFLoader(`./uploads/${source.id}.pdf`);
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
  } else {
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
  }
};
