import { QSource } from "../type";
// import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseGithub } from "../../loader/github";
import { PrismaClient } from "@prisma/client";
import { getModelInfo } from "../../utils/get-model-info";

export const githubQueueController = async (
  source: QSource,
  prisma: PrismaClient
) => {
  let options = JSON.parse(JSON.stringify(source.options));

  const loader = new DialoqbaseGithub({
    branch: options.branch,
    url: source.content!,
    is_private: options.is_private,
  });
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
};
