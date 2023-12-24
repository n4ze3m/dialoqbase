import { FastifySchema } from "fastify";

export const userLoginSchema: FastifySchema = {
  tags: ["User"],
  summary: "API to login user",
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
  tags: ["User"],
  summary: "API to update user profile",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
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
  tags: ["User"],
  summary: "API to update user password",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
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

export const isRegisterationAllowedSchema: FastifySchema = {
  tags: ["User"],
  summary: "API to check if registeration is allowed",
  response: {
    200: {
      type: "object",
      properties: {
        isRegistrationAllowed: { type: "boolean" },
      },
    }
  }
};

export const userRegisterSchema: FastifySchema = {
  tags: ["User"],
  summary: "API to register user",
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
