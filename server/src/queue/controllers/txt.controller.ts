import { QSource } from "../type";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { TextLoader } from "langchain/document_loaders/fs/text";

export const txtQueueController = async (
  source: QSource,
) => {
  console.log("loading txt");

  const location = source.location!;
  const loader = new TextLoader(location);
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
};
