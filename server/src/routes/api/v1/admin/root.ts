import { FastifyPluginAsync } from "fastify";
import {
  dialoqbaseSettingsHandler,
  updateDialoqbaseSettingsHandler,
  getAllUsersHandler,
  registerUserByAdminHandler,
  resetUserPasswordByAdminHandler,
  fetchModelFromInputedUrlHandler,
  getAllModelsHandler,
  saveModelFromInputedUrlHandler,
  deleteModelHandler,
  hideModelHandler
} from "./handlers";
import {
  dialoqbaseSettingsSchema,
  updateDialoqbaseSettingsSchema,
  getAllUsersSchema,
  registerUserByAdminSchema,
  resetUserPasswordByAdminSchema,
} from "./schema";

import {
  fetchModelFromInputedUrlSchema,
  getAllModelsSchema,
  saveModelFromInputedUrlSchema,
  toogleModelSchema
} from "./schema/model";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/dialoqbase-settings",
    {
      schema: dialoqbaseSettingsSchema,
      onRequest: [fastify.authenticate],
    },
    dialoqbaseSettingsHandler
  );

  fastify.post(
    "/dialoqbase-settings",
    {
      schema: updateDialoqbaseSettingsSchema,
      onRequest: [fastify.authenticate],
    },
    updateDialoqbaseSettingsHandler
  );

  fastify.get(
    "/users",
    {
      schema: getAllUsersSchema,
      onRequest: [fastify.authenticate],
    },
    getAllUsersHandler
  );

  fastify.post(
    "/register-user",
    {
      schema: registerUserByAdminSchema,
      onRequest: [fastify.authenticate],
    },
    registerUserByAdminHandler
  );

  fastify.post(
    "/reset-user-password",
    {
      schema: resetUserPasswordByAdminSchema,
      onRequest: [fastify.authenticate],
    },
    resetUserPasswordByAdminHandler
  );

  fastify.get(
    "/models",
    {
      schema: getAllModelsSchema,
      onRequest: [fastify.authenticate],
    },
    getAllModelsHandler
  );

  fastify.post(
    "/models",
    {
      schema: saveModelFromInputedUrlSchema,
      onRequest: [fastify.authenticate],
    },
    saveModelFromInputedUrlHandler
  );

  fastify.post(
    "/models/fetch",
    {
      schema: fetchModelFromInputedUrlSchema,
      onRequest: [fastify.authenticate],
    },
    fetchModelFromInputedUrlHandler
  );


  fastify.post(
    "/models/delete",
    {
      schema: toogleModelSchema,
      onRequest: [fastify.authenticate],
    },
    deleteModelHandler
  );


  fastify.post(
    "/models/hide",
    {
      schema: toogleModelSchema,
      onRequest: [fastify.authenticate],
    },
    hideModelHandler
  );
};

export default root;
