import { Document } from "langchain/document";
import { BaseDocumentLoader } from "langchain/document_loaders/base";
export interface RestLoaderParams {
  url: string;
  method: string;
  headers?: string;
  body?: string;
}
import axios from "axios";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class DialoqbaseRestApi extends BaseDocumentLoader
  implements RestLoaderParams {
  url: string;
  transcriber: any;
  method: string;
  headers?: string;
  body?: string;

  constructor(
    {
      url,
      method,
      body,
      headers,
    }: RestLoaderParams,
  ) {
    super();
    this.url = url;
    this.method = method;
    this.headers = headers;
    this.body = body;
  }

  private _request() {
    if (this.method === "get") {
      return axios.get(this.url, {
        headers: this.parseJson(this.headers),
      });
    }
    if (this.method === "post") {
      return axios.post(this.url, this.parseJson(this.body), {
        headers: this.parseJson(this.headers),
      });
    }

    throw new Error("Method not supported");
  }

  private parseJson = (data?: string) => {
    if (!data) {
      return undefined;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  };

  async load(): Promise<Document<Record<string, any>>[]> {
    const output = await this._request();
    const outputText = JSON.stringify(output.data);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments([
      {
        pageContent: outputText,
        metadata: {
          source: this.url,
        },
      },
    ]);
    return chunks;
  }
}
