import { FastifyPluginAsync } from "fastify";
import { chatRequestHandler, getChatStyleByIdHandler } from "./handlers";
import { chatRequestSchema, chatStyleSchema } from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/:id", {
    schema: chatRequestSchema,
  }, chatRequestHandler);

  fastify.get("/:id/style", {
    schema: chatStyleSchema,
  }, getChatStyleByIdHandler);

  fastify.get("/:id", async (request, reply) => {
    return reply.sendFile('bot.html')
  });
  
};

export default root;
