import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";
import { websiteParser } from "../utils/website-parser";
import puppeteerFetch, { closePuppeteer } from "../utils/puppeteer-fetch";

export interface WebLoaderParams {
  url: string;
  usePuppeteerFetch?: boolean;
  doNotClosePuppeteer?: boolean;
}

export class DialoqbaseWebLoader
  extends BaseDocumentLoader
  implements WebLoaderParams {
  url: string;
  usePuppeteerFetch?: boolean;
  doNotClosePuppeteer?: boolean;

  constructor({ url, usePuppeteerFetch, doNotClosePuppeteer }: WebLoaderParams) {
    super();
    this.url = url;
    this.usePuppeteerFetch = usePuppeteerFetch;
    this.doNotClosePuppeteer = doNotClosePuppeteer;
  }

  async _fetchHTML(): Promise<string> {
    if (this.usePuppeteerFetch) {
      console.log(`[DialoqbaseWebLoader] Using puppeteer to fetch ${this.url}`)
      const response = await puppeteerFetch(this.url, true);
      if (!this.doNotClosePuppeteer) {
        await closePuppeteer();
      }
      return response;
    }
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
