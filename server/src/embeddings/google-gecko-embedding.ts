import { Embeddings, EmbeddingsParams } from "langchain/embeddings/base";
import { GoogleAuth } from "google-auth-library";
import { TextServiceClient } from "@google-ai/generativelanguage";

export interface GoogleGeckoEmbeddingsParams extends EmbeddingsParams {}

export class GoogleGeckoEmbeddings extends Embeddings {
  client: TextServiceClient = new TextServiceClient();
  model: string = "models/embedding-gecko-001";

  constructor(fields?: GoogleGeckoEmbeddingsParams) {
    super(fields ?? {});

    this.client = new TextServiceClient(
      {
        authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_API_KEY!),
      },
    );
  }
  embedDocuments(documents: string[]): Promise<number[][]> {
    return Promise.all(documents.map((document) => this._embed(document)));
  }

  async embedQuery(document: string): Promise<number[]> {
    return this._embed(document);
  }
  private async _embed(text: string): Promise<number[]> {
    const response = await this.client.embedText({
      model: this.model,
      text: text,
    });
    return response[0].embedding?.value ?? [];
  }
}
