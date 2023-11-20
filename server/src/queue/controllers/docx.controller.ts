// import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { QSource } from "../type";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseDocxLoader } from "../../loader/docx";

export const DocxQueueController = async (source: QSource) => {
  console.log("loading docx");

  const location = source.location!;
  const loader = new DialoqbaseDocxLoader(location);
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
    }
  );
};
