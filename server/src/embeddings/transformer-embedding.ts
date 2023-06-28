import { Embeddings, EmbeddingsParams } from "langchain/embeddings/base";
import {
    piplelineTransformer,
//@ts-ignore
} from "../utils/pipleline.js";

export interface TransformersEmbeddingsParams extends EmbeddingsParams {
}

export class TransformersEmbeddings extends Embeddings {
  embeddings: any;

  constructor(fields?: TransformersEmbeddingsParams) {
    super(fields ?? {});
  }

  private async init() {
    if (this.embeddings) return;

    const pipeline = await piplelineTransformer();

    this.embeddings = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    );
  }

  private async _embed(text: string): Promise<number[]> {
    await this.init();
    const result = await this.embeddings!(text, {
      pooling: "mean",
      normalize: true,
    });
    return result.tolist();
  }

  embedDocuments(documents: string[]): Promise<number[][]> {
    return Promise.all(documents.map((document) => this._embed(document)));
  }
  embedQuery(document: string): Promise<number[]> {
    return this._embed(document);
  }
}
