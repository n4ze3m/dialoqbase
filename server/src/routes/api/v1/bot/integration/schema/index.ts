import { FastifySchema } from "fastify";
import { CHANNELS } from "../../../../../../utils/intergation";

export const createIntergationSchema: FastifySchema = {
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
