import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";

export interface YoutubeTranscriptParams {
  url: string;
  language_code: string;
}

export class DialoqbaseYoutubeTranscript
  extends BaseDocumentLoader
  implements YoutubeTranscriptParams
{
  language_code: string;
  url: string;

  constructor({ language_code, url }: YoutubeTranscriptParams) {
    super();
    this.language_code = language_code;
    this.url = url;
  }

  async load(): Promise<Document<Record<string, any>>[]> {
    const { YtTranscript } = await import("yt-transcript");

    const ytTranscript = new YtTranscript({
      url: this.url,
    });

    const script = await ytTranscript.getTranscript(this.language_code);

    if (!script) throw new Error("No script found");

    let text = "";

    script.forEach((item) => {
      text += item.text + " ";
    });

    return [
      {
        metadata: {
          source: this.url,
        },
        pageContent: text,
      },
    ];
  }
}
