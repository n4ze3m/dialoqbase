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

export const getDatasourceByBotIdSchema: FastifySchema = {
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
  querystring: {
    type: "object",
    properties: {
      page: { type: "number", default: 1 },
      limit: { type: "number", default: 10 },
    },
  }
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
      noOfDocumentsToRetrieve: {
        type: "number",
      },
    },
  },
};

export const createCopyBotSchema: FastifySchema = {
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
    required: ["bot_id"],
    properties: {
      bot_id: {
        type: "string",
      },
    },
  },
};

export const createBotAPISchema: FastifySchema = {
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
      name: {
        type: "string",
      },
      embedding: {
        type: "string",
      },
      model: {
        type: "string",
      },
      question_generator_prompt: {
        type: "string",
      },
      system_prompt: {
        type: "string",
      },
      temperature: {
        type: "number",
      },
      options: {
        type: "object",
        properties: {
          noOfDocumentsToRetrieve: {
            type: "number",
          },
          noOfChatHistoryInContext: {
            type: "number",
          },
          semanticSearchSimilarityScore: {
            type: "string",
            enum: ["none", "0.2", "0.5", "0.7"],
            default: "none"
          },
          autoResetSession: {
            type: "boolean",
            default: false,
          },
          internetSearchEnabled: {
            type: "boolean",
            default: false,
          },
          use_hybrid_search: {
            type: "boolean",
            default: false,
          },
          autoSyncDataSources: {
            type: "boolean",
            default: false,
          },
        },
      },
    },
  },
};

export const addNewSourceByBulkIdSchema: FastifySchema = {
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
    type: "array",
    items: {
      type: "object",
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
  },
};

export const updateBotAPISchema: FastifySchema = {
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
      name: {
        type: "string",
      },
      model: {
        type: "string",
      },
      question_generator_prompt: {
        type: "string",
      },
      system_prompt: {
        type: "string",
      },
      temperature: {
        type: "number",
      },
      streaming: {
        type: "boolean",
      },
      use_hybrid_search: {
        type: "boolean",
      },
      bot_protect: {
        type: "boolean",
      },
      bot_model_api_key: {
        type: "string",
      },
    },
  },
};

export const updateBotPasswordSettingsSchema: FastifySchema = {
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
    properties: {
      publicBotPwdProtected: {
        type: "boolean",
      },
      publicBotPwd: {
        type: "string",
      },
    },
  },
};


export const searchBotSchema: FastifySchema = {
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
    properties: {
      query: {
        type: "string",
      },
      total_results: {
        type: "number",
        default: 10,
      },
    },
    required: ["query"],
  },
};
