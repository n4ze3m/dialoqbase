import { QSource } from "../type";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const textQueueController = async (
  source: QSource,
) => {
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
};
