import { FastifySchema } from "fastify";
import { CHANNELS } from "../../../../../../utils/intergation";

export const createIntergationSchema: FastifySchema = {
  tags: ["Bot", "Integration"],
  summary: "API to create bot integration",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
  body: {
    type: "object",
    required: ["provider", "value"],
    properties: {
      provider: {
        type: "string",
        enum: CHANNELS,
      },
      value: {
        type: "object",
      },
    },
  },
};

export const pauseOrResumeIntergationSchema: FastifySchema = {
  tags: ["Bot", "Integration"],
  summary: "API to pause or resume bot integration",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
  body: {
    type: "object",
    required: ["provider"],
    properties: {
      provider: {
        type: "string",
        enum: CHANNELS,
      },
    },
  },
};

export const generateAPIKeySchema: FastifySchema = {
  tags: ["Bot", "Integration"],
  summary: "API to generate API key for bot integration",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
};

export const regenerateAPIKeySchema: FastifySchema = {
  tags: ["Bot", "Integration"],
  summary: "API to regenerate API key for bot integration",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
};

export const getAPIIntegrationSchema: FastifySchema = {
  tags: ["Bot", "Integration"],
  summary: "API to get API key for bot integration",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
};
