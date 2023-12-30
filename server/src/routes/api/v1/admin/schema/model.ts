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
      api_key: { type: "string" },
      api_type: { type: "string" },
      ollama_url: { type: "string" },
    },
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
      api_key: { type: "string" },
      api_type: { type: "string" },
    },
    required: ["url", "model_id", "name", "stream_available", "api_type"],
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
