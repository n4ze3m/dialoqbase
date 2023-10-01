import { FastifySchema } from "fastify";
import { supportedEmbeddings } from "../../../../../utils/embeddings";
import { supportedModels } from "../../../../../utils/models";
import { SUPPORTED_SOURCE_TYPES } from "../../../../../utils/datasource";

export const createBotSchema: FastifySchema = {
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
        enum: supportedEmbeddings,
      },
      model: {
        type: "string",
        enum: supportedModels,
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
      }
    },
  },
};
