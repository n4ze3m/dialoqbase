import { QSource } from "../type";
// import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseYoutube } from "../../loader/youtube";
import { PrismaClient } from "@prisma/client";
import { DialoqbaseYoutubeTranscript } from "../../loader/youtube-transcript";

export const youtubeQueueController = async (
  source: QSource,
  prisma: PrismaClient
) => {
  const {
    language_code,
    youtube_mode
  } = source.options as {
    language_code: string;
    youtube_mode: "whisper" | "transcript";
  }
  if (youtube_mode === "transcript") {
    console.log("Using Youtube Transcript Mode")
    const loader = new DialoqbaseYoutubeTranscript({
      url: source.content!,
      language_code,
    });
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(docs);

    const embeddingInfo = await prisma.dialoqbaseModels.findFirst({
      where: {
        model_id: source.embedding,
        hide: false,
        deleted: false,
      },
    });

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
  else {
    console.log("Using Youtube Whisper Mode")
    const loader = new DialoqbaseYoutube({
      url: source.content!,
    });
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(docs);

    const embeddingInfo = await prisma.dialoqbaseModels.findFirst({
      where: {
        model_id: source.embedding,
        hide: false,
        deleted: false,
      },
    });

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
