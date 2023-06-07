import { FastifyPluginAsync } from "fastify";
import {
  addNewSourceByIdHandler,
  createBotHandler,
  deleteBotByIdHandler,
  deleteSourceByIdHandler,
  getAllBotsHandler,
  getBotByIdAllSourcesHandler,
  getBotByIdEmbeddingsHandler,
  getBotByIdHandler,
  refreshSourceByIdHandler,
  updateBotByIdHandler,
  createBotPDFHandler,
  addNewSourcePDFByIdHandler
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
    onRequest: [fastify.authenticate],
  }, createBotHandler);

  // embeds
  fastify.get("/:id/embed", {
    schema: getBotByIdSchema,
    onRequest: [fastify.authenticate],
  }, getBotByIdEmbeddingsHandler);
  // all sources
  fastify.get("/:id/source", {
    schema: getBotByIdSchema,
    onRequest: [fastify.authenticate],
  }, getBotByIdAllSourcesHandler);

  // get details for settings
  fastify.get("/:id", {
    schema: getBotByIdSchema,
    onRequest: [fastify.authenticate],
  }, getBotByIdHandler);

  // add new source
  fastify.post("/:id/source", {
    schema: addNewSourceByIdSchema,
    onRequest: [fastify.authenticate],
  }, addNewSourceByIdHandler);

  // refresh source
  fastify.post("/:id/source/:sourceId/refresh", {
    schema: getBotByIdSchema,
    onRequest: [fastify.authenticate],
  }, refreshSourceByIdHandler);

  // delete source

  fastify.delete("/:id/source/:sourceId", {
    schema: getBotByIdSchema,
    onRequest: [fastify.authenticate],
  }, deleteSourceByIdHandler);

  // delete project

  fastify.delete("/:id", {
    schema: getBotByIdSchema,
    onRequest: [fastify.authenticate],
  }, deleteBotByIdHandler);

  // update project
  fastify.put("/:id", {
    schema: updateBotByIdSchema,
    onRequest: [fastify.authenticate],
  }, updateBotByIdHandler);

  // get all bots
  fastify.get("/", {
    onRequest: [fastify.authenticate],
  }, getAllBotsHandler);

  // upload pdf 
  fastify.post("/pdf", {
    onRequest: [fastify.authenticate],
  }, createBotPDFHandler);

  // add new source
  fastify.post("/:id/source/pdf", {
    onRequest: [fastify.authenticate],
  }, addNewSourcePDFByIdHandler);

};

export default root;
