import { FastifyPluginAsync } from "fastify";
import {
  createIntergationHandler,
  pauseOrResumeIntergationHandler,
} from "./handlers/post.handler";
import {
  createIntergationSchema,
  generateAPIKeySchema,
  getAPIIntegrationSchema,
  pauseOrResumeIntergationSchema,
  regenerateAPIKeySchema,
} from "./schema";

import {
  whatsappIntergationHandler,
  whatsappIntergationHandlerPost,
} from "./handlers/whatsapp.handler";

import {
  generateAPIKeyHandler,
  getAPIIntegrationHandler,
  regenerateAPIKeyHandler,
} from "./handlers/api.handler";
import { getChannelsByProvider } from "./handlers/get.handler";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  // create integration for channel
  fastify.post(
    "/:id",
    {
      schema: createIntergationSchema,
      onRequest: [fastify.authenticate],
    },
    createIntergationHandler
  );
  // pause or resume integration
  fastify.post(
    "/:id/toggle",
    {
      schema: pauseOrResumeIntergationSchema,
      onRequest: [fastify.authenticate],
    },
    pauseOrResumeIntergationHandler
  );

  // return all bot channels
  fastify.get(
    "/:id",
    {
      onRequest: [fastify.authenticate],
    },
    getChannelsByProvider
  );

  // whatsapp integration
  fastify.get("/:id/whatsapp", {}, whatsappIntergationHandler);
  fastify.post("/:id/whatsapp", {}, whatsappIntergationHandlerPost);

  // api key integration
  fastify.get(
    "/:id/api",
    {
      schema: getAPIIntegrationSchema,
      onRequest: [fastify.authenticate],
    },
    getAPIIntegrationHandler
  );

  // generate api key
  fastify.post(
    "/:id/api",
    {
      schema: generateAPIKeySchema,
      onRequest: [fastify.authenticate],
    },
    generateAPIKeyHandler
  );

  // regenerate api key
  fastify.put(
    "/:id/api",
    {
      schema: regenerateAPIKeySchema,
      onRequest: [fastify.authenticate],
    },
    regenerateAPIKeyHandler
  );
};

export default root;
