import type { FastifyReply, FastifyRequest } from "fastify";
import type { ChatLoginRequest } from "./types";
import { jwtBotSign } from "../../utils/jwt";

export const botLoginHandler = async (
  request: FastifyRequest<ChatLoginRequest>,
  reply: FastifyReply
) => {
  try {
    const public_id = request.params.id;

    const prisma = request.server.prisma;

    const bot = await prisma.bot.findFirst({
      where: {
        publicId: public_id,
      },
    });

    if (!bot) {
      return reply.code(404).send({
        message: "Bot not found",
      });
    }

    const password = request.body.password;

    if (!bot.publicBotPwdProtected) {
      return reply.code(403).send({
        message: "Bot is not password protected",
      });
    }

    if (password !== bot.publicBotPwd) {
      return reply.code(401).send({
        message: "Invalid password",
      });
    }

    const token = await jwtBotSign({
      userId: request.body.user_id,
      botId: bot.publicId,
    });

    return {
      token,
    };
  } catch (error) {
    console.error(error);
    reply.code(500).send({
      message: "Internal server error",
    });
  }
};
