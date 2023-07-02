// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { QSource } from "../type";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DialoqbaseVectorStore } from "../../utils/store";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseAudioVideoLoader } from "../../loader/audio-video";
import { convertMp4ToWave } from "../../utils/ffmpeg";

export const videoQueueController = async (
  source: QSource,
) => {
  console.log("loading video");

  const location = source.location!;

  const videoWav = await convertMp4ToWave(location);

  const loader = new DialoqbaseAudioVideoLoader(videoWav);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);

  await DialoqbaseVectorStore.fromDocuments(
    chunks,
    embeddings(source.embedding),
    {
      botId: source.botId,
      sourceId: source.id,
    },
  );
};
