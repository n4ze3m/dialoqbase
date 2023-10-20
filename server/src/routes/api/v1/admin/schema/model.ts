import { FastifySchema } from "fastify";

export const getAllModelsSchema: FastifySchema = {};

export const fetchModelFromInputedUrlSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      url: { type: "string" },
    },
    required: ["url"],
  },
};

export const saveModelFromInputedUrlSchema: FastifySchema = {
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
  body: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
    required: ["id"],
  },
};
