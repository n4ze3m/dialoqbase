import { Document } from "@langchain/core/documents";
import { Prisma, PrismaClient } from "@prisma/client";
import { Embeddings } from "@langchain/core/embeddings";
import { VectorStore } from "@langchain/core/vectorstores";
import { Callbacks } from "langchain/callbacks";
import { searchInternet } from "../internet";
const prisma = new PrismaClient();
export interface DialoqbaseLibArgs {
  botId: string;
  sourceId: string | null;
  knowledge_base_ids?: string[];
}
export function removeUUID(filename: string) {
  return filename.replace(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}-/, "");
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
  declare embeddings: Embeddings;
  knowledge_base_ids: string[];

  constructor(embeddings: Embeddings, args: DialoqbaseLibArgs) {
    super(embeddings, args);
    this.botId = args.botId;
    this.sourceId = args.sourceId;
    this.embeddings = embeddings;
    this.knowledge_base_ids = args.knowledge_base_ids || [];
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
          await prisma.$executeRaw`INSERT INTO "BotDocument" ("content", "embedding", "metadata", "botId", "sourceId") VALUES (${content}, ${vector}::vector, ${row.metadata}, ${row.botId}, ${row.sourceId})`;
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
    dbConfig: DialoqbaseLibArgs
  ) {
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }

  static async fromTexts(
    texts: string[],
    metadatas: object[] | object,
    embeddings: Embeddings,
    dbConfig: DialoqbaseLibArgs
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
    dbConfig: DialoqbaseLibArgs
  ) {
    const instance = new this(embeddings, dbConfig);
    return instance;
  }


  async similaritySearchWithSelectedKBs(
    query: number[],
    k: number,
    knowledgeBaseIds: string[]
  ) {
    const vector = `[${query?.join(",")}]`;
    const results = await prisma.$queryRaw`
      SELECT "sourceId", "content", "metadata",
             (embedding <=> ${vector}::vector) AS distance
      FROM "BotDocument"
      WHERE "sourceId" IN (${Prisma.join(knowledgeBaseIds)})
      ORDER BY distance ASC
      LIMIT ${k}
    `
    return results as {
      sourceId: string;
      content: string;
      metadata: object;
      distance: number;
    }[];
  }

  async similaritySearchVectorWithScore(
    query: number[],
    k: number,
    filter?: this["FilterType"] | undefined,
    originalQuery?: string | undefined,
  ): Promise<[Document<Record<string, any>>, number][]> {
    if (!query) {
      return [];
    }

    const bot_id = this.botId;

    const botInfo = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
    });

    const match_count = botInfo?.noOfDocumentsToRetrieve || k;

    const semanticSearchSimilarityScore =
      botInfo?.semanticSearchSimilarityScore || "none";

    let result: (number | Document<object>)[][];

    if (this.knowledge_base_ids && this.knowledge_base_ids.length > 0) {
      const data = await this.similaritySearchWithSelectedKBs(query, match_count, this.knowledge_base_ids);
      result = data.map((resp) => [
        new Document({
          metadata: resp.metadata,
          pageContent: resp.content,
        }),
        1 - resp.distance,
      ]);
    } else {
      const vector = `[${query?.join(",")}]`;
      const data = await prisma.$queryRaw`
        SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, botId := ${bot_id}::text,match_count := ${match_count}::int)
      `;
      result = (data as SearchEmbeddingsResponse[]).map((resp) => [
        new Document({
          metadata: resp.metadata,
          pageContent: resp.content,
        }),
        resp.similarity,
      ]);
    }

    let internetSearchResults = [];
    if (botInfo.internetSearchEnabled) {
      internetSearchResults = await searchInternet(this.embeddings, {
        query: originalQuery,
      });
    }

    const combinedResults = [...result, ...internetSearchResults];
    combinedResults.sort((a, b) => b[1] - a[1]);

    const topResults = combinedResults.slice(0, k);

    if (semanticSearchSimilarityScore === "none") {
      return topResults;
    }

    const similarityThreshold = parseFloat(semanticSearchSimilarityScore);
    const filteredResults = topResults.filter(
      ([, similarity]) => similarity >= similarityThreshold
    );
    return filteredResults;
  }
  async similaritySearchVectorWithScore2(
    query: number[],
    k: number,
    filter?: this["FilterType"] | undefined,
    originalQuery?: string | undefined
  ): Promise<[Document<Record<string, any>>, number][]> {
    if (!query) {
      return [];
    }
    const vector = `[${query?.join(",")}]`;
    const bot_id = this.botId;

    const botInfo = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
    });

    const match_count = k;

    const semanticSearchSimilarityScore =
      botInfo?.semanticSearchSimilarityScore || "none";

    const data = await prisma.$queryRaw`
     SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, botId := ${bot_id}::text,match_count := ${match_count}::int)
    `;

    const result = (data as SearchEmbeddingsResponse[]).map((resp) => [
      new Document({
        metadata: resp.metadata,
        pageContent: resp.content,
      }),
      resp.similarity,
    ]);

    let internetSearchResults = [];
    if (botInfo.internetSearchEnabled) {
      internetSearchResults = await searchInternet(this.embeddings, {
        query: originalQuery,
      });
    }

    const combinedResults = [...result, ...internetSearchResults];
    combinedResults.sort((a, b) => b[1] - a[1]);

    const topResults = combinedResults.slice(0, k);

    if (semanticSearchSimilarityScore === "none") {
      return topResults;
    }

    const similarityThreshold = parseFloat(semanticSearchSimilarityScore);
    const filteredResults = topResults.filter(
      ([, similarity]) => similarity >= similarityThreshold
    );
    return filteredResults;
  }
  async similaritySearch(
    query: string,
    k = 4,
    filter: this["FilterType"] | undefined = undefined,
    _callbacks: Callbacks | undefined = undefined // implement passing to embedQuery later
  ): Promise<any[]> {
    const results = await this.similaritySearchVectorWithScore(
      await this.embeddings.embedQuery(query),
      k,
      filter,
      query
    );
    return results.map((result) => result[0]);
  }
  async similaritySearchV2(
    query: string,
    k = 4,
    filter: this["FilterType"] | undefined = undefined,
    _callbacks: Callbacks | undefined = undefined // implement passing to embedQuery later
  ): Promise<any[]> {
    const results = await this.similaritySearchVectorWithScore2(
      await this.embeddings.embedQuery(query),
      k,
      filter,
      query
    );
    return results.map((result) => {
      return {
        result: {
          pageContent: result[0].pageContent,
          source: removeUUID(
            `${result[0]?.metadata?.path ||
              result[0]?.metadata?.source
              }`.replace("./uploads/", "")
          )
        },
        score: (result[1] * 100).toFixed(2)
      }
    });
  }

  _vectorstoreType(): string {
    return "dialoqbase";
  }
}
