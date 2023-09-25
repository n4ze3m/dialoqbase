import { FastifySchema } from "fastify";
import { CHANNELS } from "../../../../../../utils/intergation";

export const getChatHistoryByTypeSchema: FastifySchema = {
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
            }
        },
    },
};
