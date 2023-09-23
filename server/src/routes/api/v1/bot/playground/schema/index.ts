import { FastifySchema } from "fastify";

export const chatRequestSchema: FastifySchema = {
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
    required: ["message"],
    properties: {
      message: {
        type: "string",
      },
      history: {
        type: "array",
      },
      history_id: {
        type: "string",
      },
    },
  },
};

export const chatRequestStreamSchema: FastifySchema = {
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


export const chatPlaygroundHistorySchema: FastifySchema = {
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

export const chatPlaygroundHistoryIdSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["id", "history_id"],
    properties: {
      id: {
        type: "string",
      },
      history_id: {
        type: "string",
      }
    },
  },
};


export const audioSettingsSchema: FastifySchema = {
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
    required: ["type", "enabled"],
    properties: {
      type: {
        type: "string",
      },
      enabled: {
        type: "boolean",
      },
    },
  },
};