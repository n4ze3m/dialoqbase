import { FastifySchema } from "fastify";

export const createBotSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["content", "type"],
    properties: {
      content: {
        type: "string",
      },
      type: {
        type: "string",
        enum: ["text", "website", "crawl", "github"],
      },
      name: {
        type: "string",
      },
      embedding: {
        type: "string",
        enum: ["tensorflow", "openai", "cohere", "huggingface-api", "transformer", "google-gecko"],
      },
      model: {
        type: "string",
        enum: [
          "gpt-3.5-turbo",
          "gpt-3.5-turbo-16k",
          "gpt-4-0613",
          "gpt-4",
          "claude-1",
          "claude-2",
          "claude-instant-1",
          "google-bison"
        ],
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
        enum: ["text", "website", "crawl", "github"],
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
    },
  },
};
