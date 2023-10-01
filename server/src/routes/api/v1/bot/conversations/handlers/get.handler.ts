import { FastifyReply, FastifyRequest } from "fastify";
import {
  ChatIntergationHistoryByChatIdRequest,
  ChatIntergationHistoryByTypeRequest,
} from "./type";
import { botWebHistory } from "@prisma/client";

const getAllMessagesHelper =  (webHistory: botWebHistory[]) => {
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

  messages.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return messages;
};

export const getChatIntergationHistoryByTypeHandler = async (
  request: FastifyRequest<ChatIntergationHistoryByTypeRequest>,
  reply: FastifyReply,
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
      prisma.botWebHistory;

      const webHistory = await prisma.botWebHistory.findMany({
        where: {
          bot_id: id,
        },
      });
      const webHistoyGroupByChatId: Record<string, botWebHistory[]> = webHistory
        .reduce(
          (acc, cur) => {
            if (!acc[cur.chat_id]) {
              acc[cur.chat_id] = [];
            }
            acc[cur.chat_id].push(cur);
            return acc;
          },
          {} as Record<string, botWebHistory[]>,
        );

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

    default:
      return reply.status(404).send({
        message: "Not Found",
      });
  }
};

export const getChatHistoryByChatIdHandler = async (
  request: FastifyRequest<ChatIntergationHistoryByChatIdRequest>,
  reply: FastifyReply,
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
