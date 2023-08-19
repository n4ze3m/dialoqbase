import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetPlaygroundBotById,
  GetPlaygroundBotByIdAndHistoryId,
} from "./types";

export async function getPlaygroundHistoryByBotId(
  request: FastifyRequest<GetPlaygroundBotById>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findUnique({
    where: {
      id,
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

  return {
    history: bot.BotPlayground,
    streaming: bot.streaming,
    other_info: null,
    messages: [],
  };
}

export async function getPlaygroundHistoryByBotIdAndHistoryId(
  request: FastifyRequest<GetPlaygroundBotByIdAndHistoryId>,
  reply: FastifyReply,
) {
  const { id, history_id } = request.params;
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findUnique({
    where: {
      id,
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

  return {
    history: bot.BotPlayground,
    streaming: bot.streaming,
    other_info: details,
    messages: details.BotPlaygroundMessage,
  };
}
