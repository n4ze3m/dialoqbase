import { FastifyPluginAsync } from "fastify";
import {
  addNewSourceByIdHandler,
  createBotHandler,
  deleteBotByIdHandler,
  deleteSourceByIdHandler,
  getBotByIdAllSourcesHandler,
  getBotByIdEmbeddingsHandler,
  getBotByIdHandler,
  refreshSourceByIdHandler,
  updateBotByIdHandler,
  getAllBotsHandler
} from "./handlers";
import {
  addNewSourceByIdSchema,
  createBotSchema,
  getBotByIdSchema,
  updateBotByIdSchema,
} from "./handlers/schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/", {
    schema: createBotSchema,
  }, createBotHandler);

  // embeds
  fastify.get("/:id/embed", {
    schema: getBotByIdSchema,
  }, getBotByIdEmbeddingsHandler);
  // all sources
  fastify.get("/:id/source", {
    schema: getBotByIdSchema,
  }, getBotByIdAllSourcesHandler);

  // get details for settings
  fastify.get("/:id", {
    schema: getBotByIdSchema,
  }, getBotByIdHandler);

  // add new source
  fastify.post("/:id/source", {
    schema: addNewSourceByIdSchema,
  }, addNewSourceByIdHandler);

  // refresh source
  fastify.post("/:id/source/:sourceId/refresh", {
    schema: getBotByIdSchema,
  }, refreshSourceByIdHandler);

  // delete source

  fastify.delete("/:id/source/:sourceId", {
    schema: getBotByIdSchema,
  }, deleteSourceByIdHandler);

  // delete project

  fastify.delete("/:id", {
    schema: getBotByIdSchema,
  }, deleteBotByIdHandler);

  // update project
  fastify.put("/:id", {
    schema: updateBotByIdSchema,
  }, updateBotByIdHandler);

  // get all bots
  fastify.get("/", {},
    getAllBotsHandler
  );
};

export default root;
