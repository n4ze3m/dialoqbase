import { FastifyReply, FastifyRequest } from "fastify";
import {
  ChatIntergationHistoryByChatIdRequest,
  ChatIntergationHistoryByTypeRequest,
} from "./type";
import {
  botWebHistory,
  BotTelegramHistory,
  BotWhatsappHistory,
  BotDiscordHistory,
} from "@prisma/client";

const getAllMessagesHelper = (
  webHistory:
    | botWebHistory[]
    | BotTelegramHistory[]
    | BotWhatsappHistory[]
    | BotDiscordHistory[],
  type: string = "website"
) => {
  const messages: {
    isBot: boolean;
    message?: string | null;
    sources?: any;
    createdAt?: Date;
  }[] = [];
  if (type === "website") {
    for (const message of webHistory as botWebHistory[]) {
      messages.push({
        isBot: false,
        message: message.human,
        sources: null,
        createdAt: message.createdAt,
      });

      messages.push({
        isBot: true,
        message: message.bot,
        sources: message.sources,
        createdAt: message.createdAt,
      });
    }

    messages.sort((a, b) => {
      // @ts-ignore
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return messages;
  } else if (type === "telegram") {
    for (const message of webHistory as BotTelegramHistory[]) {
      messages.push({
        isBot: false,
        message: message.human,
      });

      messages.push({
        isBot: true,
        message: message.bot,
      });
    }
    return messages;
  } else if (type === "discord") {
    for (const message of webHistory as BotDiscordHistory[]) {
      messages.push({
        isBot: false,
        message: message.human,
      });

      messages.push({
        isBot: true,
        message: message.bot,
      });
    }
    return messages;
  } else if (type === "whatsapp") {
    for (const message of webHistory as BotWhatsappHistory[]) {
      messages.push({
        isBot: false,
        message: message.human,
      });

      messages.push({
        isBot: true,
        message: message.bot,
      });
    }
    return messages;
  }

  return messages;
};

export const getChatIntergationHistoryByTypeHandler = async (
  request: FastifyRequest<ChatIntergationHistoryByTypeRequest>,
  reply: FastifyReply
) => {
  const { id, type } = request.params;
  const prisma = request.server.prisma;

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

  switch (type) {
    case "website":
      const webHistory = await prisma.botWebHistory.findMany({
        where: {
          bot_id: id,
        },
      });
      const webHistoyGroupByChatId: Record<string, botWebHistory[]> =
        webHistory.reduce((acc, cur) => {
          if (!acc[cur.chat_id]) {
            acc[cur.chat_id] = [];
          }
          acc[cur.chat_id].push(cur);
          return acc;
        }, {} as Record<string, botWebHistory[]>);

      const result = Object.keys(webHistoyGroupByChatId).map((key) => {
        return {
          chat_id: key,
          metdata: webHistoyGroupByChatId[key][0].metadata,
          human: webHistoyGroupByChatId[key][0].human,
          bot: webHistoyGroupByChatId[key][0].bot,
          created_at: webHistoyGroupByChatId[key][0].createdAt,
          all_messages: getAllMessagesHelper(webHistoyGroupByChatId[key]),
        };
      });
      result.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      return reply.status(200).send({
        message: "Success",
        data: result,
      });

    case "telegram":
      const process_tg = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "telegram",
        },
      });
      if (!process_tg) {
        return reply.status(200).send({
          message: "Success",
          data: [],
        });
      }

      const telegramHistory = await prisma.botTelegramHistory.findMany({
        where: {
          identifier: process_tg.identifier,
        },
      });
      console.log(telegramHistory);

      // group by chat_id
      const telegramHistoryGroupByChatId: Record<string, BotTelegramHistory[]> =
        telegramHistory
          .filter((item) => item.new_chat_id)
          .reduce((acc, cur) => {
            if (cur && cur.new_chat_id) {
              if (!acc[cur.new_chat_id]) {
                acc[cur.new_chat_id] = [];
              }
              acc[cur.new_chat_id].push(cur);
            }
            return acc;
          }, {} as Record<string, BotTelegramHistory[]>);

      const telegramResult = Object.keys(telegramHistoryGroupByChatId).map(
        (key) => {
          return {
            chat_id: key,
            human: telegramHistoryGroupByChatId[key][0].human,
            bot: telegramHistoryGroupByChatId[key][0].bot,
            all_messages: getAllMessagesHelper(
              telegramHistoryGroupByChatId[key],
              "telegram"
            ),
          };
        }
      );

      return reply.status(200).send({
        message: "Success",
        data: telegramResult,
      });

    case "discord":
      const process_discord = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "discord",
        },
      });
      if (!process_discord) {
        return reply.status(200).send({
          message: "Success",
          data: [],
        });
      }

      const discordHistory = await prisma.botDiscordHistory.findMany({
        where: {
          identifier: process_discord.identifier,
        },
      });

      // group by chat_id
      const discordHistoryGroupByChatId: Record<string, BotDiscordHistory[]> =
        discordHistory
          .filter((item) => item.chat_id)
          .reduce((acc, cur) => {
            if (cur && cur.chat_id) {
              if (!acc[cur.chat_id]) {
                acc[cur.chat_id] = [];
              }
              acc[cur.chat_id].push(cur);
            }
            return acc;
          }, {} as Record<string, BotDiscordHistory[]>);

      const discordResult = Object.keys(discordHistoryGroupByChatId).map(
        (key) => {
          return {
            chat_id: key,
            human: discordHistoryGroupByChatId[key][0].human,
            bot: discordHistoryGroupByChatId[key][0].bot,
            all_messages: getAllMessagesHelper(
              discordHistoryGroupByChatId[key],
              "discord"
            ),
          };
        }
      );

      return reply.status(200).send({
        message: "Success",
        data: discordResult,
      });

    case "whatsapp":
      const process_whatsapp = await prisma.botIntegration.findFirst({
        where: {
          bot_id: id,
          provider: "whatsapp",
        },
      });
      if (!process_whatsapp) {
        return reply.status(200).send({
          message: "Success",
          data: [],
        });
      }

      const whatsappHistory = await prisma.botWhatsappHistory.findMany({
        where: {
          identifier: process_whatsapp.identifier,
        },
      });

      // group by chat_id
      const whatsappHistoryGroupByChatId: Record<string, BotWhatsappHistory[]> =
        whatsappHistory
          .filter((item) => item.chat_id)
          .reduce((acc, cur) => {
            if (cur && cur.chat_id) {
              if (!acc[cur.chat_id]) {
                acc[cur.chat_id] = [];
              }
              acc[cur.chat_id].push(cur);
            }
            return acc;
          }, {} as Record<string, BotWhatsappHistory[]>);

      const whatsappResult = Object.keys(whatsappHistoryGroupByChatId).map(
        (key) => {
          return {
            chat_id: key,
            human: whatsappHistoryGroupByChatId[key][0].human,
            bot: whatsappHistoryGroupByChatId[key][0].bot,
            all_messages: getAllMessagesHelper(
              whatsappHistoryGroupByChatId[key],
              "whatsapp"
            ),
          };
        }
      );

      return reply.status(200).send({
        message: "Success",
        data: whatsappResult,
      });

    default:
      return reply.status(404).send({
        message: "Not Found",
      });
  }
};

export const getChatHistoryByChatIdHandler = async (
  request: FastifyRequest<ChatIntergationHistoryByChatIdRequest>,
  reply: FastifyReply
) => {
  const { id, type, chat_id } = request.params;
  const prisma = request.server.prisma;

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

  switch (type) {
    case "website":
      const webHistory = await prisma.botWebHistory.findMany({
        where: {
          bot_id: id,
          chat_id: chat_id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const messages: {
        isBot: boolean;
        message?: string | null;
        sources?: any;
        createdAt: Date;
      }[] = [];

      for (const message of webHistory) {
        messages.push({
          isBot: false,
          message: message.human,
          sources: null,
          createdAt: message.createdAt,
        });

        messages.push({
          isBot: true,
          message: message.bot,
          sources: message.sources,
          createdAt: message.createdAt,
        });
      }

      return reply.status(200).send({
        message: "Success",
        meta_info: {
          total_messages: messages.length,
          other: messages.length > 0 ? webHistory[0].metadata : null,
        },
        data: messages,
      });

    default:
      return reply.status(404).send({
        message: "Not Found",
      });
  }
};
