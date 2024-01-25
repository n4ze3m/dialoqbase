import { FastifyPluginAsync } from "fastify";
import {
  chatRequestHandler,
  chatRequestStreamHandler,
  getPlaygroundHistoryByBotId,
  getPlaygroundHistoryByBotIdAndHistoryId,
  updateBotAudioSettingsHandler,
  deleteBotByPlaygroundId,
  updateBotPlaygroundTitleById
} from "../../../../../handlers/api/v1/bot/playground";
import {
  audioSettingsSchema,
  chatPlaygroundHistoryIdSchema,
  chatPlaygroundHistorySchema,
  chatRequestSchema,
  chatRequestStreamSchema,
  deleteBotByPlaygroundIdSchema,
  updateBotPlaygroundTitleByIdSchema,
} from "../../../../../schema/api/v1/bot/playground";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/:id",
    {
      schema: chatRequestSchema,
      onRequest: [fastify.authenticate],
    },
    chatRequestHandler
  );

  fastify.post(
    "/:id/stream",
    {
      schema: chatRequestStreamSchema,
      onRequest: [fastify.authenticate],
      logLevel: "silent",
    },
    chatRequestStreamHandler
  );

  fastify.get(
    "/:id/history",
    {
      schema: chatPlaygroundHistorySchema,
      onRequest: [fastify.authenticate],
    },
    getPlaygroundHistoryByBotId
  );

  fastify.get(
    "/:id/history/:history_id",
    {
      schema: chatPlaygroundHistoryIdSchema,
      onRequest: [fastify.authenticate],
    },
    getPlaygroundHistoryByBotIdAndHistoryId
  );

  fastify.post(
    "/:id/voice",
    {
      schema: audioSettingsSchema,
      onRequest: [fastify.authenticate],
    },
    updateBotAudioSettingsHandler
  );

  fastify.delete(
    "/history/:id",
    {
      onRequest: [fastify.authenticate],
      schema: deleteBotByPlaygroundIdSchema
    },
    deleteBotByPlaygroundId
  );

  fastify.put(
    "/history/:id",
    {
      onRequest: [fastify.authenticate],
      schema: updateBotPlaygroundTitleByIdSchema
    },
    updateBotPlaygroundTitleById
  );
};

export default root;
