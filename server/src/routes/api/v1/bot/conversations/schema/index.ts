import { FastifySchema } from "fastify";
import { CHANNELS } from "../../../../../../utils/intergation";

export const getChatHistoryByTypeSchema: FastifySchema = {
  tags: ["Bot", "Conversation"],
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  summary: "Get chat history by intergation type",
  params: {
    type: "object",
    required: ["id", "type"],
    properties: {
      id: {
        type: "string",
      },
      type: {
        type: "string",
        enum: CHANNELS,
      },
    },
  },
};

export const getChatHistoryByChatIdSchema: FastifySchema = {
  tags: ["Bot", "Conversation"],
  headers: {
    type: "object",
    properties: {
      Authorization: { type: "string" },
    },
    required: ["Authorization"],
  },
  summary: "Get chat history by chat id",
  params: {
    type: "object",
    required: ["id", "type", "chat_id"],
    properties: {
      id: {
        type: "string",
      },
      type: {
        type: "string",
        enum: CHANNELS,
      },
      chat_id: {
        type: "string",
      },
    },
  },
};
