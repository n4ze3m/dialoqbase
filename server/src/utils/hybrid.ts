import { Document } from "langchain/document";
import { PrismaClient } from "@prisma/client";
import { Embeddings } from "langchain/embeddings/base";
import { BaseRetriever, BaseRetrieverInput } from "langchain/schema/retriever";
import { CallbackManagerForRetrieverRun, Callbacks } from "langchain/callbacks";
const prisma = new PrismaClient();
export interface DialoqbaseLibArgs extends BaseRetrieverInput {
  botId: string;
  sourceId: string | null;
}

interface SearchEmbeddingsResponse {
  id: number;
  content: string;
  metadata: object;
  similarity: number;
}

type SearchResult = [Document, number, number];

export class DialoqbaseHybridRetrival extends BaseRetriever {
  static lc_name() {
    return "DialoqbaseHybridRetrival";
  }

  lc_namespace = ["langchain", "retrievers", "dialoqbase"];
  botId: string;
  sourceId: string | null;
  embeddings: Embeddings;
  similarityK = 5;
  keywordK = 4;

  constructor(embeddings: Embeddings, args: DialoqbaseLibArgs) {
    super(args);
    this.botId = args.botId;
    this.sourceId = args.sourceId;
    this.embeddings = embeddings;
  }

  protected async similaritySearch(
    query: string,
    k: number,
    _callbacks?: Callbacks,
  ): Promise<SearchResult[]> {
    try {

    const embeddedQuery = await this.embeddings.embedQuery(query);

    const vector = `[${embeddedQuery.join(",")}]`;
    const bot_id = this.botId;

    const data = await prisma.$queryRaw`
     SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, botId := ${bot_id}::text,match_count := ${k}::int)
    `;

    const result: [Document, number, number][] = (
      data as SearchEmbeddingsResponse[]
    ).map((resp) => [
      new Document({
        metadata: resp.metadata,
        pageContent: resp.content,
      }),
      resp.similarity * 10,
      resp.id,
    ]);


    return result;
} catch (e) {
    console.log(e)
    return []
}
  }

  protected async keywordSearch(
    query: string,
    k: number,
  ): Promise<SearchResult[]> {
    const query_text = query;
    const bot_id = this.botId;

    const data = await prisma.$queryRaw`
     SELECT * FROM "kw_match_documents"(query_text := ${query_text}::text, bot_id := ${bot_id}::text,match_count := ${k}::int)
    `;

    const result: [Document, number, number][] = (
      data as SearchEmbeddingsResponse[]
    ).map((resp) => [
      new Document({
        metadata: resp.metadata,
        pageContent: resp.content,
      }),
      resp.similarity * 10,

      resp.id,
    ]);

    // console.log("keyword search result", result)

    return result;
  }

  protected async hybridSearch(
    query: string,
    similarityK: number,
    keywordK: number,
    callbacks?: Callbacks,
  ): Promise<SearchResult[]> {
    const similarity_search = this.similaritySearch(
      query,
      similarityK,
      callbacks,
    );

    const keyword_search = this.keywordSearch(query, keywordK);

    return Promise.all([similarity_search, keyword_search])
      .then((results) => results.flat())
      .then((results) => {
        const picks = new Map<number, SearchResult>();

        results.forEach((result) => {
          const id = result[2];
          const nextScore = result[1];
          const prevScore = picks.get(id)?.[1];

          if (prevScore === undefined || nextScore > prevScore) {
            picks.set(id, result);
          }
        });

        return Array.from(picks.values());
      })
      .then((results) => results.sort((a, b) => b[1] - a[1]));
  }

  async _getRelevantDocuments(
    query: string,
    runManager?: CallbackManagerForRetrieverRun,
  ): Promise<Document[]> {
    const searchResults = await this.hybridSearch(
      query,
      this.similarityK,
      this.keywordK,
      runManager?.getChild("hybrid_search"),
    );

    return searchResults.map(([doc]) => doc);
  }
}
