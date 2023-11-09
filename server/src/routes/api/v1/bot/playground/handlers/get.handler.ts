import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetPlaygroundBotById,
  GetPlaygroundBotByIdAndHistoryId,
} from "./types";
import {
  getElevenLab,
} from "../../../../../../utils/elevenlabs";

export async function getPlaygroundHistoryByBotId(
  request: FastifyRequest<GetPlaygroundBotById>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
    },
    include: {
      BotPlayground: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const {
    eleven_labs_api_key_present,
    eleven_labs_api_key_valid,
    voices
  } = await getElevenLab()

  return {
    history: bot.BotPlayground,
    streaming: bot.streaming,
    other_info: null,
    text_to_speech_type: bot.text_to_voice_type,
    text_to_speech_settings: bot.text_to_voice_type_metadata,
    text_to_speech_enabled: bot.text_to_voice_enabled,
    eleven_labs_api_key_present,
    eleven_labs_api_key_valid,
    voices,
    messages: [],
  };
}

export async function getPlaygroundHistoryByBotIdAndHistoryId(
  request: FastifyRequest<GetPlaygroundBotByIdAndHistoryId>,
  reply: FastifyReply,
) {
  const { id, history_id } = request.params;
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
    },
    include: {
      BotPlayground: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const details = await prisma.botPlayground.findFirst({
    where: {
      id: history_id,
      botId: id,
    },
    include: {
      BotPlaygroundMessage: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!details) {
    return reply.status(404).send({
      message: "History not found",
    });
  }
  const {
    eleven_labs_api_key_present,
    eleven_labs_api_key_valid,
    voices
  } = await getElevenLab()


  return {
    history: bot.BotPlayground,
    streaming: bot.streaming,
    other_info: details,
    messages: details.BotPlaygroundMessage,
    text_to_speech_type: bot.text_to_voice_type,
    text_to_speech_settings: bot.text_to_voice_type_metadata,
    text_to_speech_enabled: bot.text_to_voice_enabled,
    eleven_labs_api_key_present,
    eleven_labs_api_key_valid,
    voices,
  };
}
