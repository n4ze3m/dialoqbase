import { Document } from "langchain/dist/document";
import { PrismaClient } from "@prisma/client";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
const prisma = new PrismaClient();
export interface DialoqbaseLibArgs {
  botId: string;
  sourceId: string;
}

export class DialoqbaseVectorStore {
  botId: string;
  sourceId: string;
  embeddings: OpenAIEmbeddings;

  constructor(embeddings: OpenAIEmbeddings, args: DialoqbaseLibArgs) {
    this.botId = args.botId;
    this.sourceId = args.sourceId;
    this.embeddings = embeddings;
  }
  async addVectors(vectors: number[][], documents: Document[]): Promise<void> {
    const rows = vectors.map((embedding, idx) => ({
      content: documents[idx].pageContent,
      embedding,
      metadata: documents[idx].metadata,
      botId: this.botId,
      sourceId: this.sourceId,
    }));

    const chunkSize = 500;

    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      // this is bad method right ?
      try {
        chunk.forEach(async (row) => {
          await prisma.$executeRawUnsafe(
            'INSERT INTO "BotDocument" ("content", "embedding", "metadata", "botId", "sourceId") VALUES ($1, $2, $3, $4, $5)',
            row.content,
            row.embedding,
            row.metadata,
            row.botId,
            row.sourceId
          );
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
  async addDocuments(documents: Document[]): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    const embeddings = await this.embeddings.embedDocuments(texts);
    return this.addVectors(embeddings, documents);
  }
  static async fromDocuments(
    docs: Document[],
    embeddings: OpenAIEmbeddings,
    dbConfig: DialoqbaseLibArgs
  ) {
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }
}
