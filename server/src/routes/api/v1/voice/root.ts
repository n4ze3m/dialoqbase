import { FastifyPluginAsync } from "fastify";
import { voiceTTSHandler } from "./handlers/post.handler";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/11labs/tts", {
    onRequest: [fastify.authenticate],
  }, voiceTTSHandler);
};

export default root;
