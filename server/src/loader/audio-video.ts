import { BufferLoader } from "langchain/document_loaders/fs/buffer";
import { Document } from "langchain/document";
import {
  piplelineTransformer,
  //@ts-ignore
} from "../utils/pipleline.js";
import { WaveFile } from "wavefile";

export class DialoqbaseAudioVideoLoader extends BufferLoader {
  transcriber: any;

  constructor(filePath: string) {
    super(filePath);
  }

  private async init() {
    if (this.transcriber) return;

    const pipeline = await piplelineTransformer();

    this.transcriber = await pipeline(
      "automatic-speech-recognition",
      process.env.WHISPER_MODEL || "distil-whisper/distil-medium.en"
    );
  }

  private async _convert(audio: Buffer) {
    const wav = new WaveFile(audio);
    wav.toBitDepth("32f");
    wav.toSampleRate(16000);
    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
      console.log(
        "Multiple channels detected. Selecting the first channel only."
      );
      audioData = audioData[0];
    }
    return audioData;
  }

  public async parse(
    raw: Buffer,
    metadata: Document["metadata"]
  ): Promise<Document[]> {
    await this.init();
    const audioData = await this._convert(raw);
    let output = (await this.transcriber(audioData, {
      chunk_length_s: 30,
      return_timestamps: true,
    })) as {
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
          ...metadata,
          audio: {
            chunks: output.chunks,
          },
        },
      }),
    ];
  }
}
