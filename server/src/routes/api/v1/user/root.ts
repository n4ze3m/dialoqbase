import { FastifyPluginAsync } from "fastify";
import {
  isRegisterationAllowedHandler,
  meHandler,
  registerUserHandler,
  updatePasswordHandler,
  updateProfileHandler,
  userLoginHandler,
} from "./handlers";
import {
  isRegisterationAllowedSchema,
  updatePasswordSchema,
  updateProfileSchema,
  userLoginSchema,
  userRegisterSchema,
} from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/login",
    {
      schema: userLoginSchema,
    },
    userLoginHandler,
  );

  fastify.post(
    "/me",
    {
      schema: updateProfileSchema,
      onRequest: [fastify.authenticate],
    },
    updateProfileHandler,
  );

  fastify.post(
    "/update-password",
    {
      schema: updatePasswordSchema,
      onRequest: [fastify.authenticate],
    },
    updatePasswordHandler,
  );

  fastify.get(
    "/info",
    {
      schema: isRegisterationAllowedSchema,
    },
    isRegisterationAllowedHandler,
  );

  fastify.post(
    "/register",
    {
      schema: userRegisterSchema,
    },
    registerUserHandler,
  );

  fastify.get(
    "/is-admin",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      reply.send({ is_admin: request.user.is_admin });
    },
  );

  fastify.get(
    "/me",
    {
      onRequest: [fastify.authenticate],
    },
    meHandler,
  );
};

export default root;
