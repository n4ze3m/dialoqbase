import { FastifyRequest, FastifyReply } from "fastify";
import { GetYoutubeTranscript } from "./types";
import { YtTranscript } from "yt-transcript"

const getYoutubeTranscript = async (url: string) => {
    const transcript = new YtTranscript({ url });
    const data = await transcript.listAllTranscripts();
    return data;
}

export const getYoutubeTranscriptHandler = async (
    request: FastifyRequest<GetYoutubeTranscript>,
    reply: FastifyReply
) => {
    const { url } = request.query;

    const available = await getYoutubeTranscript(url);

    return {
        data: available as any
    }
}