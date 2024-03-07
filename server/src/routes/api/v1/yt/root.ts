import { FastifyPluginAsync } from "fastify";
import { getYoutubeTranscriptHandler } from "../../../../handlers/api/v1/yt";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
    fastify.get(
        "/transcript",
        {
            schema: {
                tags: ["Youtube"],
                summary: "API to get available transcript from youtube video url",
                querystring: {
                    type: "object",
                    properties: {
                        url: { type: "string" },
                    },
                    required: ["url"],
                }
            },
        },
        getYoutubeTranscriptHandler
    );
};

export default root;
