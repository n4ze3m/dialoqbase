import { QSource } from "../type";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { PrismaClient } from "@prisma/client";
import { getModelInfo } from "../../utils/get-model-info";
import * as fs from "fs/promises"

export const jsonQueueController = async (
    source: QSource,
    prisma: PrismaClient
) => {
    console.log("loading json");

    const location = source.location!;

    const json = await fs.readFile(location, "utf-8");

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: source.chunkSize,
        chunkOverlap: source.chunkOverlap,
    });

    const chunks = await textSplitter.splitDocuments([
        {
            pageContent: json,
            metadata: {
                source: location,
            },
        },
    ]);

    const embeddingInfo = await getModelInfo({
        model: source.embedding,
        prisma,
        type: "embedding",
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
};
