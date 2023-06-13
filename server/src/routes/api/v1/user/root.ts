import { FastifyPluginAsync } from "fastify";
import {
  userLoginHandler,
  updatePasswordHandler,
  updateUsernameHandler,
} from "./handlers";
import {
  userLoginSchema,
  updatePasswordSchema,
  updateUsernameSchema,
} from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/login",
    {
      schema: userLoginSchema,
    },
    userLoginHandler
  );

  fastify.post(
    "/update-username",
    {
      schema: updateUsernameSchema,
      onRequest: [fastify.authenticate]
    },
    updateUsernameHandler
  );

  fastify.post(
    "/update-password",
    {
      schema: updatePasswordSchema,
      onRequest: [fastify.authenticate]
    },
    updatePasswordHandler
  );
};

export default root;
