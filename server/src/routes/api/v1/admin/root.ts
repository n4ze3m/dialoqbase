import { FastifyPluginAsync } from "fastify";
import {
  dialoqbaseSettingsHandler,
  updateDialoqbaseSettingsHandler,
} from "./handlers";
import {
  dialoqbaseSettingsSchema,
  updateDialoqbaseSettingsSchema,
} from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/dialoqbase-settings",
    {
      schema: dialoqbaseSettingsSchema,
      onRequest: [fastify.authenticate],
    },
    dialoqbaseSettingsHandler,
  );

  fastify.post(
    "/dialoqbase-settings",
    {
      schema: updateDialoqbaseSettingsSchema,
      onRequest: [fastify.authenticate],
    },
    updateDialoqbaseSettingsHandler,
  );
};

export default root;
