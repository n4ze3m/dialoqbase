import { createFFmpeg } from "@ffmpeg.wasm/main";
export const ffmpeg = createFFmpeg({ log: true });
import * as fs from "fs/promises";

const _init = async () => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  console.log("ffmpeg loaded");
};

export const convertMp4ToWave = async (file_path: string) => {
  await _init();
  const video = await fs.readFile(file_path);
  ffmpeg.FS("writeFile", "./video.mp4", video);
  await ffmpeg.run(
    "-i",
    "./video.mp4",
    "-acodec",
    "pcm_s16le",
    "-ac",
    "1",
    "-ar",
    "16000",
    "./audio.wav"
  );
  const data = ffmpeg.FS("readFile", "./audio.wav");
  const new_file_path = file_path.replace(".mp4", ".wav");
  await fs.writeFile(new_file_path, data);
  ffmpeg.exit();
  return new_file_path;
};

export const convertMp3ToWave = async (file_path: string) => {
  await _init();
  const audio = await fs.readFile(file_path);
  ffmpeg.FS("writeFile", "./audio.mp3", audio);
  await ffmpeg.run(
    "-i",
    "./audio.mp3",
    "-acodec",
    "pcm_s16le",
    "-ac",
    "1",
    "-ar",
    "16000",
    "./audio.wav"
  );
  const data = ffmpeg.FS("readFile", "./audio.wav");
  const new_file_path = file_path.replace(".mp3", ".wav");
  await fs.writeFile(new_file_path, data);
  ffmpeg.exit();
  return new_file_path;
};

export const convertOggToWave = async (file_path: string) => {
  await _init();
  const audio = await fs.readFile(file_path);
  ffmpeg.FS("writeFile", "./audio.ogg", audio);
  await ffmpeg.run(
    "-i",
    "./audio.ogg",
    "-acodec",
    "pcm_s16le",
    "-ac",
    "1",
    "-ar",
    "16000",
    "./audio.wav"
  );

  const data = ffmpeg.FS("readFile", "./audio.wav");
  const new_file_path = file_path.replace(".ogg", ".wav");
  await fs.writeFile(new_file_path, data);
  ffmpeg.exit();
  return new_file_path;
};

export const convertMp3ToWaveFromBuffer = async (audio: Buffer) => {
  await _init();
  ffmpeg.FS("writeFile", "./audio.mp3", audio);
  await ffmpeg.run(
    "-i",
    "./audio.mp3",
    "-acodec",
    "pcm_s16le",
    "-ac",
    "1",
    "-ar",
    "16000",
    "./audio.wav"
  );
  const data = ffmpeg.FS("readFile", "./audio.wav");
  ffmpeg.exit();
  return data;
};
