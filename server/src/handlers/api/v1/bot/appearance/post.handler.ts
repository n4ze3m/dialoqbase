import { FastifyReply, FastifyRequest } from "fastify";
import { SaveBotAppearance } from "./types";

export const postBotAppearanceHandler = async (
  request: FastifyRequest<SaveBotAppearance>,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const { id } = request.params;

  const isBotExist = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
    },
  });

  if (!isBotExist) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const isAppearanceExist = await prisma.botAppearance.findFirst({
    where: {
      bot_id: id,
    },
  });

  if (isAppearanceExist) {
    await prisma.botAppearance.update({
      where: {
        id: isAppearanceExist.id,
      },
      data: {
        ...request.body,
        // needs to be removed
        background_color: "#ffffff",
      },
    });
  } else {
    await prisma.botAppearance.create({
      data: {
        ...request.body,
        bot_id: id,
        // needs to be removed
        background_color: "#ffffff",
      },
    });
  }

  return {
    message: "Bot appearance saved successfully",
  };
};
