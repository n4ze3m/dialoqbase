import { Embeddings, EmbeddingsParams } from "langchain/embeddings/base";
import {
  piplelineTransformer,
  //@ts-ignore
} from "../utils/pipleline.js";

export interface TransformersEmbeddingsParams extends EmbeddingsParams {
  model?: string;
}

export class TransformersEmbeddings extends Embeddings {
  embeddings: any;
  model: string = "Xenova/all-MiniLM-L6-v2";

  constructor(fields?: TransformersEmbeddingsParams) {
    super(fields ?? {});
    if (fields?.model) this.model = fields.model;
  }

  private async init() {
    if (this.embeddings) return;

    const pipeline = await piplelineTransformer();

    this.embeddings = await pipeline(
      "feature-extraction",
      this.model,
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
