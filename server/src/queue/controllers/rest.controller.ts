import { QSource } from "../type";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseRestApi } from "../../loader/rest";
import { PrismaClient } from "@prisma/client";
import { getModelInfo } from "../../utils/get-model-info";

export const restQueueController = async (
  source: QSource,
  prisma: PrismaClient
) => {
  let options = JSON.parse(JSON.stringify(source.options));

  const loader = new DialoqbaseRestApi({
    method: options.method,
    url: source.content!,
    body: options.body,
    headers: options.headers,
  });
  const docs = await loader.load();

  const embeddingInfo = await getModelInfo({
    model: source.embedding,
    prisma,
    type: "embedding",
  })

  if (!embeddingInfo) {
    throw new Error("Embedding not found. Please verify the embedding id");
  }

  await DialoqbaseVectorStore.fromDocuments(
    docs,
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
};
