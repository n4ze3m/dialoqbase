import { FastifyReply, FastifyRequest } from "fastify";
import { createIntergationType, PauseIntergationType } from "./type";
import { geProviderRequiredFields } from "../../../../../../utils/intergation";

import TelegramBot from "../../../../../../integration/telegram";

export const createIntergationHandler = async (
  request: FastifyRequest<createIntergationType>,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const isBot = await prisma.bot.findUnique({
    where: {
      id,
    },
  });

  if (!isBot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const requiredFiled = geProviderRequiredFields(request.body.provider);

  if (!requiredFiled) {
    return reply.status(400).send({
      message: "Invalid type",
    });
  }

  const isRequiredField = requiredFiled.every((field) => {
    return request.body.value[field];
  });

  if (!isRequiredField) {
    return reply.status(400).send({
      message: "Missing required field",
    });
  }

  switch (request.body.provider) {
    case "telegram":
      const process_name = `dialoqbase-telegram-${id}`;
      const isProcess = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "telegram",
        },
      });

      const isValidToken = await TelegramBot.isValidate(
        request.body.value.telegram_bot_token,
      );

      if (!isValidToken) {
        return reply.status(400).send({
          message: "Invalid token",
        });
      }

      if (isProcess) {
        await prisma.botIntegration.update({
          where: {
            id: isProcess.id,
          },
          data: {
            telegram_bot_token: request.body.value.telegram_bot_token,
          },
        });
      } else {
        await prisma.botIntegration.create({
          data: {
            bot_id: id,
            provider: "telegram",
            telegram_bot_token: request.body.value.telegram_bot_token,
            identifier: process_name,
          },
        });
      }

      await TelegramBot.connect(
        process_name,
        request.body.value.telegram_bot_token,
      );

      return reply.status(200).send({
        message: "Integration created",
      });

    default:
      return reply.status(400).send({
        message: "Invalid type",
      });
  }
};

export const pauseOrResumeIntergationHandler = async (
  request: FastifyRequest<PauseIntergationType>,
  reply: FastifyReply,
) => {
  const prismas = request.server.prisma;
  const bot_id = request.params.id;

  const isBot = await prismas.bot.findUnique({
    where: {
      id: bot_id,
    },
  });

  if (!isBot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const getIntegration = await prismas.botIntegration.findFirst({
    where: {
      bot_id,
      provider: request.body.provider,
    },
  });

  if (!getIntegration) {
    return reply.status(404).send({
      message: `${request.body.provider} integration not found`,
    });
  }

  switch (request.body.provider) {
    case "telegram":
      if (getIntegration.is_pause) {
        await prismas.botIntegration.update({
          where: {
            id: getIntegration.id,
          },
          data: {
            is_pause: false,
          },
        });

        await TelegramBot.connect(
          getIntegration.identifier,
          getIntegration.telegram_bot_token!,
        );
      } else {
        await prismas.botIntegration.update({
          where: {
            id: getIntegration.id,
          },
          data: {
            is_pause: true,
          },
        });

        await TelegramBot.disconnect(getIntegration.identifier);
      }

      return reply.status(200).send({
        message: "Integration updated",
      });

    default:
      return reply.status(400).send({
        message: "Invalid type",
      });
  }
};
