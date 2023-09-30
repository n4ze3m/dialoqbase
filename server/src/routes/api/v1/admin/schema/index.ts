import { FastifySchema } from "fastify";

export const dialoqbaseSettingsSchema: FastifySchema = {
  response: {
    200: {
      noOfBotsPerUser: { type: "number" },
      allowUserToCreateBots: { type: "boolean" },
      allowUserToRegister: { type: "boolean" },
    },
  },
};

export const updateDialoqbaseSettingsSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      noOfBotsPerUser: { type: "number" },
      allowUserToCreateBots: { type: "boolean" },
      allowUserToRegister: { type: "boolean" },
    },
    required: [
      "noOfBotsPerUser",
      "allowUserToCreateBots",
      "allowUserToRegister",
    ],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
