import { FastifyReply, FastifyRequest } from "fastify";
import {
  createIntergationType,
  PauseIntergationType,
} from "./type";
import { geProviderRequiredFields } from "../../../../../../utils/intergation";

import TelegramBot from "../../../../../../integration/telegram";
import DiscordBot from "../../../../../../integration/discord";
import WhatsappBot from "../../../../../../integration/whatsapp";

import SlackBot from "../../../../../../integration/slack";
// import { writeFile } from "fs";

export const createIntergationHandler = async (
  request: FastifyRequest<createIntergationType>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const isBot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
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
    // return request.body.value[field];
    // if value is in boolean
    return (
      typeof request.body.value[field] === "boolean" ||
      !!request.body.value[field]
    );
  });

  if (!isRequiredField) {
    return reply.status(400).send({
      message: "Missing required field",
    });
  }

  switch (request.body.provider) {
    case "telegram":
      const process_name_tg = `dialoqbase-telegram-${id}`;
      const isProcess_tg = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "telegram",
        },
      });

      const isValidToken = await TelegramBot.isValidate(
        request.body.value.telegram_bot_token
      );

      if (!isValidToken) {
        return reply.status(400).send({
          message: "Invalid token",
        });
      }

      if (isProcess_tg) {
        await prisma.botIntegration.update({
          where: {
            id: isProcess_tg.id,
          },
          data: {
            telegram_bot_token: request.body.value.telegram_bot_token,
          },
        });

        if (!isProcess_tg.is_pause) {
          await TelegramBot.connect(
            process_name_tg,
            request.body.value.telegram_bot_token
          );
        }
      } else {
        await prisma.botIntegration.create({
          data: {
            bot_id: id,
            provider: "telegram",
            telegram_bot_token: request.body.value.telegram_bot_token,
            identifier: process_name_tg,
          },
        });

        await TelegramBot.connect(
          process_name_tg,
          request.body.value.telegram_bot_token
        );
      }

      return reply.status(200).send({
        message: "Integration created",
      });

    case "discord":
      const process_name_dc = `dialoqbase-discord-${id}`;
      const isProcess_dc = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "discord",
        },
      });

      const isValidToken_dc = await DiscordBot.isValidate(
        request.body.value.discord_bot_token
      );

      if (!isValidToken_dc) {
        return reply.status(400).send({
          message: "Invalid token",
        });
      }

      if (isProcess_dc) {
        await prisma.botIntegration.update({
          where: {
            id: isProcess_dc.id,
          },
          data: {
            discord_bot_token: request.body.value.discord_bot_token,
            discord_application_id: request.body.value.discord_application_id,
            discord_slash_command: request.body.value.discord_slash_command,
            discord_slash_command_description:
              request.body.value.discord_slash_command_description,
            discord_show_sources:
              !!request.body.value.discord_show_sources &&
              request.body.value.discord_show_sources != "false",
            discord_smart_label:
              !!request.body.value.discord_smart_label &&
              request.body.value.discord_smart_label != "false",
          },
        });

        if (!isProcess_dc.is_pause) {
          await DiscordBot.connect(
            process_name_dc,
            request.body.value.discord_bot_token,
            request.body.value.discord_slash_command,
            request.body.value.discord_slash_command_description,
            request.body.value.discord_show_sources,
            request.body.value.discord_smart_label
          );
        }
      } else {
        await prisma.botIntegration.create({
          data: {
            bot_id: id,
            provider: "discord",
            discord_bot_token: request.body.value.discord_bot_token,
            discord_application_id: request.body.value.discord_application_id,
            discord_slash_command: request.body.value.discord_slash_command,
            discord_slash_command_description:
              request.body.value.discord_slash_command_description,
            discord_show_sources: request.body.value.discord_show_sources,
            discord_smart_label: request.body.value.discord_smart_label,
            identifier: process_name_dc,
          },
        });

        await DiscordBot.connect(
          process_name_dc,
          request.body.value.discord_bot_token,
          request.body.value.discord_slash_command,
          request.body.value.discord_slash_command_description,
          request.body.value.discord_show_sources,
          request.body.value.discord_smart_label
        );
      }

      return reply.status(200).send({
        message: "Integration created",
      });

    case "whatsapp":
      const process_name_wa = `dialoqbase-whatsapp-${id}`;
      const isProcess_wa = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "whatsapp",
        },
      });

      if (isProcess_wa) {
        await prisma.botIntegration.update({
          where: {
            id: isProcess_wa.id,
          },
          data: {
            whatsapp_verify_token: request.body.value.whatsapp_verify_token,
            whatsapp_phone_number: request.body.value.whatsapp_phone_number,
            whatsapp_access_token: request.body.value.whatsapp_access_token,
          },
        });
      } else {
        await prisma.botIntegration.create({
          data: {
            bot_id: id,
            provider: "whatsapp",
            whatsapp_verify_token: request.body.value.whatsapp_verify_token,
            whatsapp_phone_number: request.body.value.whatsapp_phone_number,
            whatsapp_access_token: request.body.value.whatsapp_access_token,
            identifier: process_name_wa,
          },
        });
      }

      await WhatsappBot.connect(
        isBot.id,
        request.body.value.whatsapp_phone_number,
        request.body.value.whatsapp_access_token
      );

      return reply.status(200).send({
        message: "Integration created",
      });

    case "slack":
      const process_name_sl = `dialoqbase-slack-${id}`;
      const isProcess_sl = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "slack",
        },
      });

      if (isProcess_sl) {
        await prisma.botIntegration.update({
          where: {
            id: isProcess_sl.id,
          },
          data: {
            slack_auth_token: request.body.value.slack_auth_token,
            slack_signing_secret: request.body.value.slack_signing_secret,
            slack_app_token: request.body.value.slack_app_token,
          },
        });
      } else {
        await prisma.botIntegration.create({
          data: {
            bot_id: id,
            provider: "slack",
            slack_auth_token: request.body.value.slack_auth_token,
            slack_signing_secret: request.body.value.slack_signing_secret,
            slack_app_token: request.body.value.slack_app_token,
            identifier: process_name_sl,
          },
        });
      }

      await SlackBot.connect(
        process_name_sl,
        request.body.value.slack_auth_token,
        request.body.value.slack_signing_secret,
        request.body.value.slack_app_token
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
  reply: FastifyReply
) => {
  const prismas = request.server.prisma;
  const bot_id = request.params.id;

  const isBot = await prismas.bot.findFirst({
    where: {
      id: bot_id,
      user_id: request.user.user_id,
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
          getIntegration.telegram_bot_token!
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

    case "discord":
      if (getIntegration.is_pause) {
        await prismas.botIntegration.update({
          where: {
            id: getIntegration.id,
          },
          data: {
            is_pause: false,
          },
        });

        await DiscordBot.connect(
          getIntegration.identifier,
          getIntegration.discord_bot_token!,
          getIntegration.discord_slash_command!,
          getIntegration.discord_slash_command_description!,
          getIntegration.discord_show_sources!,
          getIntegration.discord_smart_label!
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

        await DiscordBot.disconnect(getIntegration.identifier);
      }

      return reply.status(200).send({
        message: "Integration updated",
      });

    case "whatsapp":
      if (getIntegration.is_pause) {
        await prismas.botIntegration.update({
          where: {
            id: getIntegration.id,
          },
          data: {
            is_pause: false,
          },
        });

        await WhatsappBot.connect(
          bot_id,
          getIntegration.whatsapp_phone_number!,
          getIntegration.whatsapp_access_token!
        );

        return reply.status(200).send({
          message: "Integration updated",
        });
      } else {
        await prismas.botIntegration.update({
          where: {
            id: getIntegration.id,
          },
          data: {
            is_pause: true,
          },
        });

        await WhatsappBot.disconnect(bot_id);

        return reply.status(200).send({
          message: "Integration updated",
        });
      }

    default:
      return reply.status(400).send({
        message: "Invalid type",
      });
  }
};
