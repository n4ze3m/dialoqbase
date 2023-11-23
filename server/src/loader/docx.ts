import { BufferLoader } from "langchain/document_loaders/fs/buffer";
import { Document } from "langchain/document";
import * as mammoth from "mammoth";

export class DialoqbaseDocxLoader extends BufferLoader {
  constructor(filePathOrBlob: string | Blob) {
    super(filePathOrBlob);
  }

  public async parse(
    raw: Buffer,
    metadata: Document["metadata"]
  ): Promise<Document[]> {
    const data = await mammoth.extractRawText({ buffer: raw });
    const text = data.value;
    const meta = { source: this.filePathOrBlob };
    if (text) {
      return [new Document({ pageContent: text, metadata: meta })];
    }
    return [];
  }
}
