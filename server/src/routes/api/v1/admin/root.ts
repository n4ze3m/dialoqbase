import { FastifyPluginAsync } from "fastify";
import {
  dialoqbaseSettingsHandler,
  updateDialoqbaseSettingsHandler,
  getAllUsersHandler,
  registerUserByAdminHandler,
  resetUserPasswordByAdminHandler
} from "./handlers";
import {
  dialoqbaseSettingsSchema,
  updateDialoqbaseSettingsSchema,
  getAllUsersSchema,
  registerUserByAdminSchema,
  resetUserPasswordByAdminSchema
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

  fastify.get(
    "/users",
    {
      schema: getAllUsersSchema,
      onRequest: [fastify.authenticate],
    },
    getAllUsersHandler,
  );

  fastify.post(
    "/register-user",
    {
      schema: registerUserByAdminSchema,
      onRequest: [fastify.authenticate],
    },
    registerUserByAdminHandler,
  );

  fastify.post(
    "/reset-user-password",
    {
      schema: resetUserPasswordByAdminSchema,
      onRequest: [fastify.authenticate],
    },
    resetUserPasswordByAdminHandler,
  );
};

export default root;
