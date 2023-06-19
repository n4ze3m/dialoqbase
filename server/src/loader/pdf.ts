import { BufferLoader } from "langchain/document_loaders/fs/buffer";
import { Document } from "langchain/document";
import * as pdfjS from "pdfjs-dist";

export class DialoqbasePDFLoader extends BufferLoader {
  private splitPages: boolean;

  constructor(
    filePathOrBlob: string | Blob,
    { splitPages = true } = {},
  ) {
    super(filePathOrBlob);
    this.splitPages = splitPages;
  }

  public async parse(
    raw: Buffer,
    metadata: Document["metadata"],
  ): Promise<Document[]> {
    const pdf = await pdfjS.getDocument({
      data: new Uint8Array(raw.buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    }).promise;
    const meta = await pdf.getMetadata().catch(() => null);

    const documents: Document[] = [];

    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      if (content.items.length === 0) {
        continue;
      }

      const text = content.items.map((item: any) => item.str).join("\n")
        .replace(/\x00/g, "").trim();
      documents.push(
        new Document({
          pageContent: text,
          metadata: {
            ...metadata,
            pdf: {
              info: meta?.info,
              metadata: meta?.metadata,
              totalPages: pdf.numPages,
            },
            loc: {
              pageNumber: i,
            },
          },
        }),
      );
    }

    if (this.splitPages) {
      return documents;
    }

    if (documents.length === 0) {
      return [];
    }

    return [
      new Document({
        pageContent: documents.map((doc) => doc.pageContent).join("\n\n"),
        metadata: {
          ...metadata,
          pdf: {
            info: meta?.info,
            metadata: meta?.metadata,
            totalPages: pdf.numPages,
          },
        },
      }),
    ];
  }
}
