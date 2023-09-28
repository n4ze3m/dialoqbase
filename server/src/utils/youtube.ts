import * as ytdl from "ytdl-core";

export function isYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}

// IDK this way is legit or not
// If you know better way, please tell me
export async function downloadYoutubeAudio(
  videoLink: string,
): Promise<Buffer | null> {
  try {
    const download = ytdl(videoLink, { quality: "highestaudio" });

    // Create a buffer to store the audio data
    const chunks: Uint8Array[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      download.on("data", (chunk) => {
        chunks.push(chunk);
      });

      download.on("end", () => {
        // Concatenate all the chunks into a single buffer
        const audioBuffer = Buffer.concat(chunks);
        resolve(audioBuffer);
      });

      download.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error downloading the video:", error);
    return null;
  }
}

export const getYoutubeVideoId = (url: string): string => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (!youtubeRegex.test(url)) {
    throw new Error("Not a valid youtube url");
  }

  const youtubeVideoIdRegex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/;
  const youtubeVideoIdRegexRes = url.match(youtubeVideoIdRegex);
  if (!youtubeVideoIdRegexRes) {
    throw new Error("Not a valid youtube url");
  }

  return youtubeVideoIdRegexRes[1];
};
