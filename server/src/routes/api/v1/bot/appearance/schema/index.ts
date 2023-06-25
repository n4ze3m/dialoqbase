import { FastifySchema } from "fastify";

export const getBotAppearanceByIdSchema: FastifySchema = {
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
