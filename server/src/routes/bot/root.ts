import { FastifyPluginAsync } from "fastify";
import {
  chatRequestHandler,
  chatRequestStreamHandler,
  getChatStyleByIdHandler,
  chatRequestAPIHandler,
} from "./handlers";
import {
  chatRequestSchema,
  chatRequestStreamSchema,
  chatStyleSchema,
  chatAPIRequestSchema,
} from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/:id",
    {
      schema: chatRequestSchema,
    },
    chatRequestHandler
  );

  fastify.post(
    "/:id/stream",
    {
      schema: chatRequestStreamSchema,
      logLevel: "silent",
    },
    chatRequestStreamHandler
  );

  fastify.get(
    "/:id/style",
    {
      schema: chatStyleSchema,
    },
    getChatStyleByIdHandler
  );

  fastify.post(
    "/:id/api",
    {
      schema: chatAPIRequestSchema,
    },
    chatRequestAPIHandler
  );

  fastify.get("/:id", async (request, reply) => {
    return reply.sendFile("bot.html");
  });
};

export default root;
