import { FastifyReply, FastifyRequest } from "fastify";
import {  UpdateBotAudioSettings } from "./types";


export const updateBotAudioSettingsHandler = async (
  request: FastifyRequest<UpdateBotAudioSettings>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { type, enabled } = request.body;

  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  if (type === "elevenlabs") {
    await prisma.bot.update({
      where: {
        id,
      },
      data: {
        text_to_voice_enabled: enabled,
        text_to_voice_type: "elevenlabs",
      },
    });
  } else if (type === "web_api") {
    await prisma.bot.update({
      where: {
        id,
      },
      data: {
        text_to_voice_enabled: enabled,
        text_to_voice_type: "web_api",
      },
    });
  }

  return {
    success: true,
  };
};
