import { FastifyPluginAsync } from "fastify";
import { createBotHandler } from "./handlers";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/", createBotHandler);
};

export default root;
