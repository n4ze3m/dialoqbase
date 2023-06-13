import { QSource } from "../type";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";

export const websiteQueueController = async (

    source: QSource,
) => {
    

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