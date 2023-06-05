import { FastifyPluginAsync } from "fastify";
import {
  createBotHandler,
  getBotByIdAllSourcesHandler,
  getBotByIdEmbeddingsHandler,
  getBotByIdHandler,
  addNewSourceByIdHandler,
  refreshSourceByIdHandler,
  deleteSourceByIdHandler,
deleteBotByIdHandler  ,
updateBotByIdHandler
} from "./handlers";
import { createBotSchema, getBotByIdSchema , addNewSourceByIdSchema, updateBotByIdSchema} from "./handlers/schema";

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

};

export default root;
