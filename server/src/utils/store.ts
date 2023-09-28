import { Document } from "langchain/document";
import { PrismaClient } from "@prisma/client";
import { Embeddings } from "langchain/embeddings/base";
import { VectorStore } from "langchain/vectorstores/base";
const prisma = new PrismaClient();
export interface DialoqbaseLibArgs {
  botId: string;
  sourceId: string | null;
}

interface SearchEmbeddingsResponse {
  id: number;
  content: string;
  metadata: object;
  similarity: number;
}

export class DialoqbaseVectorStore extends VectorStore {
  botId: string;
  sourceId: string | null;
  embeddings: Embeddings;

  constructor(embeddings: Embeddings, args: DialoqbaseLibArgs) {
    super(embeddings, args);
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

    try {
      rows.forEach(async (row) => {
        if (row?.embedding) {
          const vector = `[${row.embedding.join(",")}]`;
          const content = row?.content.replace(/\x00/g, "").trim();
          await prisma
            .$executeRaw`INSERT INTO "BotDocument" ("content", "embedding", "metadata", "botId", "sourceId") VALUES (${content}, ${vector}::vector, ${row.metadata}, ${row.botId}, ${row.sourceId})`;
        }
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async addDocuments(documents: Document[]): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    const embeddings = await this.embeddings.embedDocuments(texts);
    return this.addVectors(embeddings, documents);
  }
  static async fromDocuments(
    docs: Document[],
    embeddings: Embeddings,
    dbConfig: DialoqbaseLibArgs,
  ) {
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }

  static async fromTexts(
    texts: string[],
    metadatas: object[] | object,
    embeddings: Embeddings,
    dbConfig: DialoqbaseLibArgs,
  ) {
    const docs = [];
    for (let i = 0; i < texts.length; i += 1) {
      const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
      const newDoc = new Document({
        pageContent: texts[i],
        metadata,
      });
      docs.push(newDoc);
    }
    return this.fromDocuments(docs, embeddings, dbConfig);
  }

  static async fromExistingIndex(
    embeddings: Embeddings,
    dbConfig: DialoqbaseLibArgs,
  ) {
    const instance = new this(embeddings, dbConfig);
    return instance;
  }

  async similaritySearchVectorWithScore(
    query: number[],
    k: number,
    filter?: this["FilterType"] | undefined,
  ): Promise<[Document<Record<string, any>>, number][]> {
    console.log(this.botId);
    const vector = `[${query.join(",")}]`;
    const bot_id = this.botId;

    const data = await prisma.$queryRaw`
     SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, botId := ${bot_id}::text,match_count := ${k}::int)
    `;

    const result: [Document, number][] = (
      data as SearchEmbeddingsResponse[]
    ).map((resp) => [
      new Document({
        metadata: resp.metadata,
        pageContent: resp.content,
      }),
      resp.similarity,
    ]);
    return result;
  }

  _vectorstoreType(): string {
    return "dialoqbase";
  }
}
