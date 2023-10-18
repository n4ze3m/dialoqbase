import { FastifyPluginAsync } from "fastify";
import {
  chatRequestHandler,
  chatRequestStreamHandler,
  getPlaygroundHistoryByBotId,
  getPlaygroundHistoryByBotIdAndHistoryId,
  updateBotAudioSettingsHandler,
} from "./handlers";
import {
  audioSettingsSchema,
  chatPlaygroundHistoryIdSchema,
  chatPlaygroundHistorySchema,
  chatRequestSchema,
  chatRequestStreamSchema,
} from "./schema";

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
};

export default root;
