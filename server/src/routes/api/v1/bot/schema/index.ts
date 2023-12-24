import { FastifySchema } from "fastify";
import { SUPPORTED_SOURCE_TYPES } from "../../../../../utils/datasource";

export const createBotSchema: FastifySchema = {
  tags: ["Bot"],
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
      content: {
        type: "string",
      },
      type: {
        type: "string",
        enum: SUPPORTED_SOURCE_TYPES,
      },
      name: {
        type: "string",
      },
      embedding: {
        type: "string",
      },
      model: {
        type: "string",
      },
      maxDepth: {
        type: "number",
      },
      maxLinks: {
        type: "number",
      },
      options: {
        type: "object",
      },
    },
  },
};

export const getBotByIdSchema: FastifySchema = {
  tags: ["Bot"],
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

export const addNewSourceByIdSchema: FastifySchema = {
  tags: ["Bot"],
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
    required: ["content", "type"],
    properties: {
      content: {
        type: "string",
      },
      type: {
        type: "string",
        enum: SUPPORTED_SOURCE_TYPES,
      },
      maxDepth: {
        type: "number",
      },
      maxLinks: {
        type: "number",
      },

      options: {
        type: "object",
      },
    },
  },
};

export const updateBotByIdSchema: FastifySchema = {
  tags: ["Bot"],
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
    required: ["name", "temperature", "model"],
    properties: {
      name: {
        type: "string",
      },
      temperature: {
        type: "number",
      },
      model: {
        type: "string",
      },
      streaming: {
        type: "boolean",
      },
      questionGeneratorPrompt: {
        type: "string",
      },
      qaPrompt: {
        type: "string",
      },
      showRef: {
        type: "boolean",
      },
      use_hybrid_search: {
        type: "boolean",
      },
      bot_protect: {
        type: "boolean",
      },
      use_rag: {
        type: "boolean",
      },
      bot_model_api_key: {
        type: "string",
      },
    },
  },
};
