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
        enum: ["text", "website", "crawl"],
      },
      name: {
        type: "string",
      },
      embedding: {
        type: "string",
        enum: ["tensorflow", "openai", "cohere", "huggingface-api"],
      },
      model: {
        type: "string",
        enum: ["gpt-3.5-turbo", "gpt-4", "claude-1", "claude-instant-1"],
      },
      maxDepth: {
        type: "number",
      },
      maxLinks: {
        type: "number",
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
        enum: ["text", "website", "crawl"],
      },
      maxDepth: {
        type: "number",
      },
      maxLinks: {
        type: "number",
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
    },
  },
};
