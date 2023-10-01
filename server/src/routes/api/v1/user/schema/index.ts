import { FastifySchema } from "fastify";

export const userLoginSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  },
};

export const updateProfileSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["username", "email"],
    properties: {
      username: {
        type: "string",
      },
      email: {
        type: "string",
      },
    },
  },
};

export const updatePasswordSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["oldPassword", "newPassword"],
    properties: {
      oldPassword: {
        type: "string",
      },
      newPassword: {
        type: "string",
      },
    },
  },
};

export const isRegisterationAllowedSchema: FastifySchema = {};


export const userRegisterSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["username", "password", "email"],
    properties: {
      username: {
        type: "string",
      },
      password: {
        type: "string",
      },
      email: {
        type: "string",
      },
    },
  },
};
