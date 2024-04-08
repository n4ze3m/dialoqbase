import { FastifyReply, FastifyRequest } from "fastify";
import { ChatTTSRequest } from "./types";
import {
  isElevenLabAPIKeyPresent,
  isElevenLabAPIValid,
  isOpenAIAPIKeyPresent,
  textToSpeech,
  textToSpeechOpenAI,
} from "../../utils/voice";

export const chatTTSHandler = async (
  request: FastifyRequest<ChatTTSRequest>,
  reply: FastifyReply
) => {
  const bot_id = request.params.id;
  const prisma = request.server.prisma;
  const chat_id = request.body.id;

  const isBotExist = await prisma.bot.findFirst({
    where: {
      publicId: bot_id,
    },
  });

  if (!isBotExist) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  let text = "";

  const botAppearance = await prisma.botAppearance.findFirst({
    where: {
      bot_id: isBotExist.id,
    },
  });

  if (!botAppearance) {
    return reply.status(404).send({
      message: "Bot configuration not found",
    });
  }

  if (chat_id === "first-message") {
    text = botAppearance?.first_message! || "";
  } else {
    const chat = await prisma.botWebHistory.findFirst({
      where: {
        id: chat_id,
      },
    });

    if (!chat) {
      return reply.status(404).send({
        message: "Chat not found",
      });
    }

    text = chat.bot!;
  }

  if (!botAppearance.tts) {
    return reply.status(404).send({
      message: "TTS not enabled for this bot",
    });
  }
  if (botAppearance?.tts_provider === "eleven_labs") {
    if (!isElevenLabAPIKeyPresent()) {
      return reply.status(400).send({
        message: "Eleven Labs API key not present",
      });
    }
    const is11LabAPIVValid = await isElevenLabAPIValid();
    if (!is11LabAPIVValid) {
      return reply.status(400).send({
        message: "Eleven Labs API key not valid",
      });
    }
    const buffer = await textToSpeech(text, botAppearance.tts_voice!);
    return reply.status(200).send(buffer);
  } else if (botAppearance.tts_provider === "openai") {
    const isOpenAIKeyPresent = isOpenAIAPIKeyPresent();
    if (!isOpenAIKeyPresent) {
      return reply.status(400).send({
        message: "OpenAI API key not present",
      });
    }
    const buffer = await textToSpeechOpenAI(
      text,
      botAppearance.tts_voice!,
      botAppearance.tts_model!
    );
    return reply.status(200).send(buffer);
  } else {
    return reply.status(404).send({
      message: "TTS provider not found",
    });
  }
};
