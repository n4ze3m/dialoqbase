import type { FastifyReply, FastifyRequest } from "fastify";
import type { UpdateBotPasswordSettings } from "./types";

export const updateBotPasswordSettings = async (
  request: FastifyRequest<UpdateBotPasswordSettings>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const prisma = request.server.prisma;

    const { publicBotPwdProtected, publicBotPwd } = request.body;
    const user_id = request.user.user_id;

    const bot = await prisma.bot.findFirst({
      where: {
        id: id,
        user_id: user_id,
      },
    });

    if (!bot) {
      return reply.status(404).send({ message: "Bot not found" });
    }

    if (publicBotPwdProtected) {
      if (!publicBotPwd) {
        return reply.status(400).send({ message: "Password is required" });
      }
    }

    await prisma.bot.update({
      where: {
        id: id,
      },
      data: {
        publicBotPwd: publicBotPwd,
        publicBotPwdProtected: publicBotPwdProtected,
      },
    });


    return {
        message: "Bot password settings updated successfully",
    }

  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: "Internal server error" });
  }
};
