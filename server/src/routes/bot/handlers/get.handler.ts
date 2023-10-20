import { FastifyReply, FastifyRequest } from "fastify";
import { ChatStyleRequest } from "./types";

export const getChatStyleByIdHandler = async (
  request: FastifyRequest<ChatStyleRequest>,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const bot_id = request.params.id;

  const isBotExist = await prisma.bot.findFirst({
    where: {
      publicId: bot_id,
    },
  });

  if (!isBotExist) {
    return reply.send({
      data: {
        background_color: "#ffffff",
        bot_name: "ACME Inc. Bot",
        streaming: false,
        show_reference: false,
        chat_bot_bubble_style: {
          background_color: "#C3CDDB",
          text_color: "#000000",
        },
        chat_human_bubble_style: {
          background_color: "#2590EB",
          text_color: "#ffffff",
        },
        first_message: "Hi, I'm here to help. What can I do for you today?",
      },
    });
  }

  const botAppearance = await prisma.botAppearance.findFirst({
    where: {
      bot_id: isBotExist.id,
    },
  });

  if (botAppearance) {
    return {
      data: {
        ...botAppearance,
        streaming: isBotExist.streaming,
        show_reference: isBotExist.showRef,
        bot_id: undefined,
      },
    };
  }
  request.session.is_bot_allowed = true;
  return {
    data: {
      background_color: "#ffffff",
      bot_name: "ACME Inc. Bot",
      streaming: isBotExist.streaming,
      show_reference: isBotExist.showRef,
      chat_bot_bubble_style: {
        background_color: "#C3CDDB",
        text_color: "#000000",
      },
      chat_human_bubble_style: {
        background_color: "#2590EB",
        text_color: "#ffffff",
      },
      first_message: "Hi, I'm here to help. What can I do for you today?",
    },
  };
};
