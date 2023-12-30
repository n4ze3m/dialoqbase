import { FastifyPluginAsync } from "fastify";
import { voiceTTSHandler } from "./handlers/post.handler";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/11labs/tts",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Voice"],
        headers: {
          type: "object",
          properties: {
            Authorization: { type: "string" },
          },
          required: ["Authorization"],
        },
        summary: "API to get voice from text",
        body: {
          type: "object",
          properties: {
            text: { type: "string" },
            voice_id: { type: "string" },
          },
          required: ["text", "voice_id"],
        },
      },
    },
    voiceTTSHandler
  );
};

export default root;
