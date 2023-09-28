import { Document } from "langchain/document";
import {
  piplelineTransformer,
  //@ts-ignore
} from "../utils/pipleline.js";
import { WaveFile } from "wavefile";
import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { downloadYoutubeAudio, isYouTubeUrl } from "../utils/youtube";
import { convertMp3ToWaveFromBuffer } from "../utils/ffmpeg.js";

export interface YoutubeLoaderParams {
  url: string;
}

// this is not a good way to do this but it works
export class DialoqbaseYoutube extends BaseDocumentLoader
  implements YoutubeLoaderParams {
  url: string;
  transcriber: any;

  private async init() {
    if (this.transcriber) return;

    const pipeline = await piplelineTransformer();

    this.transcriber = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en",
    );
  }

  constructor(
    {
      url,
    }: YoutubeLoaderParams,
  ) {
    super();
    this.url = url;
  }

  private async _convert(audio: Buffer | Uint8Array) {
    const wav = new WaveFile(audio);
    wav.toBitDepth("32f");
    wav.toSampleRate(16000);
    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
      console.log(
        "Multiple channels detected. Selecting the first channel only.",
      );
      audioData = audioData[0];
    }
    return audioData;
  }

  async load(): Promise<Document<Record<string, any>>[]> {
    const url = this.url;
    if (!isYouTubeUrl(url)) {
      throw new Error("Not a valid youtube url");
    }
    await this.init();
    const raw = await downloadYoutubeAudio(url);

    if (!raw) {
      throw new Error("Error downloading the video");
    }

    const mp3Wav = await convertMp3ToWaveFromBuffer(raw);

    const audioData = await this._convert(mp3Wav);

    let output = await this.transcriber(audioData, {
      chunk_length_s: 30,
      return_timestamps: true,
    }) as {
      text: string;
      chunks: {
        timestamp: number[];
        text: string;
      }[];
    };

    return [
      new Document({
        pageContent: output.text,
        metadata: {
          source: this.url,
          audio: {
            chunks: output.chunks,
          },
        },
      }),
    ];
  }
}
