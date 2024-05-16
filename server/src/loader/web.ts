import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";
import { websiteParser } from "../utils/website-parser";

export interface WebLoaderParams {
  url: string;
}

export class DialoqbaseWebLoader
  extends BaseDocumentLoader
  implements WebLoaderParams
{
  url: string;

  constructor({ url }: WebLoaderParams) {
    super();
    this.url = url;
  }

  async _fetchHTML(): Promise<string> {
    const response = await fetch(this.url);
    return await response.text();
  }

  async load(): Promise<Document<Record<string, any>>[]> {
    const html = await this._fetchHTML();
    const text = websiteParser(html);
    const metadata = { source: this.url };
    return [new Document({ pageContent: text, metadata })];
  }
}
