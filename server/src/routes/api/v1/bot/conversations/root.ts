import { FastifyPluginAsync } from "fastify";
import {
  getChatHistoryByChatIdHandler,
  getChatIntergationHistoryByTypeHandler,
} from "./handlers";
import {
  getChatHistoryByChatIdSchema,
  getChatHistoryByTypeSchema,
} from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/:id/:type",
    {
      schema: getChatHistoryByTypeSchema,
      onRequest: [fastify.authenticate],
    },
    getChatIntergationHistoryByTypeHandler,
  );

  fastify.get(
    "/:id/:type/:chat_id",
    {
      schema: getChatHistoryByChatIdSchema,
      onRequest: [fastify.authenticate],
    },
    getChatHistoryByChatIdHandler,
  );
};

export default root;
