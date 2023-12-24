import { FastifySchema } from "fastify";

export const getAllModelsSchema: FastifySchema = {
  tags: ["Admin"],
  summary: "API to get all models",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
};

export const fetchModelFromInputedUrlSchema: FastifySchema = {
  tags: ["Admin"],
  summary: "API to fetch avialable model from inputed url",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  body: {
    type: "object",
    properties: {
      url: { type: "string" },
    },
    required: ["url"],
  },
};

export const saveModelFromInputedUrlSchema: FastifySchema = {
  tags: ["Admin"],
  summary: "API to save model from inputed url",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  body: {
    type: "object",
    properties: {
      url: { type: "string" },
      model_id: { type: "string" },
      name: { type: "string" },
      stream_available: { type: "boolean" },
    },
    required: ["url", "model_id", "name", "stream_available"],
  },
};

export const toogleModelSchema: FastifySchema = {
  tags: ["Admin"],
  summary: "API to toogle model",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  body: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
    required: ["id"],
  },
};
