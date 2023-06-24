import { FastifyPluginAsync } from "fastify";
import { getBotAppearanceByIdHandler } from "./handlers";
import { getBotAppearanceByIdSchema } from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/:id",
    {
      schema: getBotAppearanceByIdSchema,
      onRequest: [fastify.authenticate],
    },
    getBotAppearanceByIdHandler,
  );
};

export default root;
