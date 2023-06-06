import { FastifyPluginAsync } from "fastify";
import { chatRequestHandler } from "./handlers";
import { chatRequestSchema } from "./handlers/schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/:id", {
    schema: chatRequestSchema,
  }, chatRequestHandler);


  fastify.get("/:id", async (request, reply) => {
    return reply.sendFile('bot.html')
  });
};

export default root;
