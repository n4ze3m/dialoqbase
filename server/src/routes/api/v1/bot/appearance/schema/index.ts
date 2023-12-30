import { FastifySchema } from "fastify";

export const getBotAppearanceByIdSchema: FastifySchema = {
  tags: ["Bot", "Appearance"],
  summary: "API to get bot appearance by id",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  },
};

export const saveBotAppearanceSchema: FastifySchema = {
  tags: ["Bot", "Appearance"],
  summary: "API to save bot appearance by id",
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  },
  body: {
    type: "object",
    properties: {
      background_color: {
        type: "string",
      },
      bot_name: {
        type: "string",
      },
      chat_bot_bubble_style: {
        type: "object",
        properties: {
          background_color: {
            type: "string",
          },
          text_color: {
            type: "string",
          },
        },
      },
      chat_human_bubble_style: {
        type: "object",
        properties: {
          background_color: {
            type: "string",
          },
          text_color: {
            type: "string",
          },
        },
      },
      first_message: {
        type: "string",
      },
    },
  },
};
