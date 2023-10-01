import { FastifyReply, FastifyRequest } from "fastify";
import { GetBotAppearanceById } from "./types";

export const getBotAppearanceByIdHandler = async (
  request: FastifyRequest<GetBotAppearanceById>,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const bot_id = request.params.id;

  const isBotExist = await prisma.bot.findFirst({
    where: {
      id: bot_id,
      user_id: request.user.user_id,
    },
  });

  if (!isBotExist) {
    return reply.status(404).send({
      statusCode: 404,
      message: "Bot not found",
    });
  }

  const botAppearance = await prisma.botAppearance.findFirst({
    where: {
      bot_id: bot_id,
    },
  });

  if (botAppearance) {
    return {
      public_id: isBotExist.publicId,
      data: botAppearance,
    };
  }

  return {
    public_id: isBotExist.publicId,
    data: {
      background_color: "#ffffff",
      bot_name: "ACME Inc. Bot",
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
