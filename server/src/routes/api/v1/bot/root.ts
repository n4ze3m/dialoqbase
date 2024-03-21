import { FastifyPluginAsync } from "fastify";
import {
  addNewSourceByIdHandler,
  addNewSourceFileByIdHandler,
  createBotFileHandler,
  createBotHandler,
  deleteBotByIdHandler,
  deleteSourceByIdHandler,
  getAllBotsHandler,
  getBotByIdAllSourcesHandler,
  getBotByIdEmbeddingsHandler,
  getBotByIdHandler,
  refreshSourceByIdHandler,
  updateBotByIdHandler,
  getCreateBotConfigHandler,
  getBotByIdSettingsHandler,
  createCopyHandler,
  createBotAPIHandler,
  addNewSourceByIdBulkHandler,
  addNewSourceFileByIdBulkHandler,
  chatRequestAPIHandler,
  isBotReadyHandler,
  updateBotAPIByIdHandler
} from "../../../../handlers/api/v1/bot/bot";
import {
  addNewSourceByIdSchema,
  createBotSchema,
  getBotByIdSchema,
  updateBotByIdSchema,
  createCopyBotSchema,
  createBotAPISchema,
  addNewSourceByBulkIdSchema,
  updateBotAPISchema
} from "../../../../schema/api/v1/bot/bot";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: createBotSchema,
      onRequest: [fastify.authenticate],
    },
    createBotHandler
  );

  // embeds
  fastify.get(
    "/:id/embed",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    getBotByIdEmbeddingsHandler
  );
  // all sources
  fastify.get(
    "/:id/source",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    getBotByIdAllSourcesHandler
  );

  // get details for settings
  fastify.get(
    "/:id",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    getBotByIdHandler
  );

  // add new source
  fastify.post(
    "/:id/source",
    {
      schema: addNewSourceByIdSchema,
      onRequest: [fastify.authenticate],
    },
    addNewSourceByIdHandler
  );

  // refresh source
  fastify.post(
    "/:id/source/:sourceId/refresh",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    refreshSourceByIdHandler
  );

  // delete source

  fastify.delete(
    "/:id/source/:sourceId",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    deleteSourceByIdHandler
  );

  // delete project

  fastify.delete(
    "/:id",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    deleteBotByIdHandler
  );

  // update project
  fastify.put(
    "/:id",
    {
      schema: updateBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    updateBotByIdHandler
  );

  // get all bots
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Bot"],
        summary: "API to get all bots",
        headers: {
          type: "object",
          properties: {
            Authorization: { type: "string" },
          },
          required: ["Authorization"],
        },
      },
    },
    getAllBotsHandler
  );

  fastify.post(
    "/upload",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Bot"],
        summary: "API to upload files",
        headers: {
          type: "object",
          properties: {
            Authorization: { type: "string" },
          },
          required: ["Authorization"],
        },
      },
    },
    createBotFileHandler
  );

  // add new source
  fastify.post(
    "/:id/source/upload",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Bot"],
        summary: "API to upload files",
        headers: {
          type: "object",
          properties: {
            Authorization: { type: "string" },
          },
          required: ["Authorization"],
        },
      },
    },
    addNewSourceFileByIdHandler
  );

  // get bot config
  fastify.get(
    "/config",
    {
      schema: {
        tags: ["Bot"],
        summary: "API to get bot configuraion",
      },
    },
    getCreateBotConfigHandler
  );

  // get bot settings by id
  fastify.get(
    "/:id/settings",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    getBotByIdSettingsHandler
  );


  // create copy bot
  fastify.post(
    "/:bot_id/copy",
    {
      schema: createCopyBotSchema,
      onRequest: [fastify.authenticate],
    },
    createCopyHandler
  );

  // for sdk
  fastify.post(
    "/api",
    {
      schema: createBotAPISchema,
      onRequest: [fastify.authenticate],
    },
    createBotAPIHandler
  );

  // add new source by bulk id
  fastify.post(
    "/:id/source/bulk",
    {
      schema: addNewSourceByBulkIdSchema,
      onRequest: [fastify.authenticate],
    },
    addNewSourceByIdBulkHandler
  );

  // add new source for bulk
  fastify.post(
    "/:id/source/upload/bulk",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Bot"],
        summary: "API to upload files as source",
        headers: {
          type: "object",
          properties: {
            Authorization: { type: "string" },
          },
          required: ["Authorization"],
        },
      },
    },
    addNewSourceFileByIdBulkHandler
  );

  // for api
  fastify.post(
    "/:id/chat",
    {
      schema: {
        tags: ["Bot"],
        summary: "API to send message to bot",
        headers: {
          type: "object",
          required: ["Authorization"],
          properties: {
            Authorization: { type: "string" },
          },
        },
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
            },
          },
        },

        body: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
            },
            history: {
              type: "array",
              default: [],
            },
            history_id: {
              type: "string",
            },
            stream: {
              type: "boolean",
            },
          },
        },
      },
      onRequest: [fastify.authenticate],
    },
    chatRequestAPIHandler
  )

  fastify.get(
    "/:id/is-ready",
    {
      schema: getBotByIdSchema,
      onRequest: [fastify.authenticate],
    },
    isBotReadyHandler
  );

  fastify.put(
    "/:id/update",
    {
      schema: updateBotAPISchema,
      onRequest: [fastify.authenticate],
    },
    updateBotAPIByIdHandler
  );
};

export default root;
