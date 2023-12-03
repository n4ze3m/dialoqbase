import {
  piplelineTransformer,
  //@ts-ignore
} from "../../../utils/pipleline.js";
import { WaveFile } from "wavefile";

function _convert(audio: Buffer) {
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

export const convertTextToAudio = async (audioData: Buffer) => {
  const pipeline = await piplelineTransformer();
  const transcriber = await pipeline(
    "automatic-speech-recognition",
    process.env.WHISPER_MODEL || "distil-whisper/distil-medium.en"
  );

  const audio = _convert(Buffer.from(audioData));
  let output = (await transcriber(audio, {
    chunk_length_s: 30,
  })) as {
    text: string;
  };

  return output;
};
