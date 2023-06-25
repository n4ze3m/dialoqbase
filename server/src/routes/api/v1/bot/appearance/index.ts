import { FastifyPluginAsync } from "fastify";
import {
  getBotAppearanceByIdHandler,
  postBotAppearanceHandler,
} from "./handlers";
import { getBotAppearanceByIdSchema, saveBotAppearanceSchema } from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/:id",
    {
      schema: getBotAppearanceByIdSchema,
      onRequest: [fastify.authenticate],
    },
    getBotAppearanceByIdHandler,
  );

  fastify.post(
    "/:id",
    {
      schema: saveBotAppearanceSchema,
      onRequest: [fastify.authenticate],
    },
    postBotAppearanceHandler,
  );
};

export default root;
