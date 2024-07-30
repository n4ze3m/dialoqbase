import { FastifyReply, FastifyRequest } from "fastify";

import { GetBotRequestById, GetSourceByIds } from "./types";
import TelegramBot from "../../../../../integration/telegram";

export const deleteSourceByIdHandler = async (
  request: FastifyRequest<GetSourceByIds>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const bot_id = request.params.id;
  const source_id = request.params.sourceId;

  const bot = await prisma.bot.findFirst({
    where: {
      id: bot_id,
      user_id: request.user?.is_admin ? undefined : request.user?.user_id
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const botSource = await prisma.botSource.findFirst({
    where: {
      id: source_id,
      botId: bot.id,
    },
  });

  if (!botSource) {
    return reply.status(404).send({
      message: "Source not found",
    });
  }

  if (botSource.isPending) {
    const job = await request.server.queue.getJob(botSource.id);
    if (job) {
      const isActive = await job.isActive();
      if (isActive) {
        return reply.status(400).send({
          message: "Source is  being processed, cannot delete it now",
        });
      }
      await job.remove();
    }
  }

  await prisma.$transaction([
    prisma.botDocument.deleteMany({
      where: {
        botId: bot.id,
        sourceId: source_id,
      },
    }),
    prisma.botSource.delete({
      where: {
        id: source_id,
      },
    }),
  ]);

  return {
    id: bot.id,
  };
};

export const deleteBotByIdHandler = async (
  request: FastifyRequest<GetBotRequestById>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user?.is_admin ? undefined : request.user?.user_id
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const botIntegrations = await prisma.botIntegration.findMany({
    where: {
      bot_id: bot.id,
    },
  });

  botIntegrations.forEach(async (botIntegration) => {
    if (botIntegration.provider === "telegram") {
      await TelegramBot.disconnect(botIntegration.identifier);
    }
  });

  await prisma.$transaction([
    prisma.botIntegration.deleteMany({
      where: {
        bot_id: bot.id,
      },
    }),
    prisma.botDocument.deleteMany({
      where: {
        botId: bot.id,
      },
    }),
    prisma.botSource.deleteMany({
      where: {
        botId: bot.id,
      },
    }),
  ]);

  const botPlayground = await prisma.botPlayground.findMany({
    where: {
      botId: bot.id,
    },
  });

  await prisma.$transaction([
    prisma.botPlaygroundMessage.deleteMany({
      where: {
        botPlaygroundId: {
          in: botPlayground.map((bp) => bp.id),
        },
      },
    }),
    prisma.botPlayground.deleteMany({
      where: {
        botId: bot.id,
      },
    }),
    prisma.bot.delete({
      where: {
        id: bot.id,
      },
    }),
  ]);

  return {
    message: "Bot deleted",
  };
};
