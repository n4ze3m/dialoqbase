import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteUserRequest } from "./type";
import TelegramBot from "../../../../integration/telegram";

export const adminDeleteUserHandler = async (
  request: FastifyRequest<DeleteUserRequest>,
  reply: FastifyReply
) => {
  try {
    const prisma = request.server.prisma;
    const user = request.user;

    if (!user || !user.user_id) {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }

    if (user.user_id === request.body.user_id) {
      return reply.status(400).send({
        message: "You cannot delete yourself",
      });
    }

    const userToDelete = await prisma.user.findUnique({
      where: {
        user_id: request.body.user_id,
      },
      select: {
        user_id: true,
        isAdministrator: true,
      },
    });

    if (!userToDelete) {
      return reply.status(404).send({
        message: "User not found",
      });
    }

    if (userToDelete.isAdministrator) {
      return reply.status(403).send({
        message: "You cannot delete an admin",
      });
    }

    await prisma.$transaction(async (tx) => {
      const bots = await tx.bot.findMany({
        where: {
          user_id: request.body.user_id,
        },
        select: {
          id: true,
        },
      });

      const botIds = bots.map((bot) => bot.id);

      if (botIds.length > 0) {
        const botIntegrations = await tx.botIntegration.findMany({
          where: {
            bot_id: {
              in: botIds,
            },
          },
        });

        for (const botIntegration of botIntegrations) {
          if (botIntegration.provider === "telegram") {
            await TelegramBot.disconnect(botIntegration.identifier);
          }
        }

        await tx.botIntegration.deleteMany({
          where: {
            bot_id: {
              in: botIds,
            },
          },
        });

        await tx.botDocument.deleteMany({
          where: {
            botId: {
              in: botIds,
            },
          },
        });

        await tx.botSource.deleteMany({
          where: {
            botId: {
              in: botIds,
            },
          },
        });

        const botPlaygrounds = await tx.botPlayground.findMany({
          where: {
            botId: {
              in: botIds,
            },
          },
          select: {
            id: true,
          },
        });

        const playgroundIds = botPlaygrounds.map((bp) => bp.id);

        await tx.botPlaygroundMessage.deleteMany({
          where: {
            botPlaygroundId: {
              in: playgroundIds,
            },
          },
        });

        await tx.botPlayground.deleteMany({
          where: {
            botId: {
              in: botIds,
            },
          },
        });

        await tx.bot.deleteMany({
          where: {
            id: {
              in: botIds,
            },
          },
        });
      }
      await tx.userApiKey.deleteMany({
        where: {
          user_id: request.body.user_id,
        },
      });
      await tx.user.delete({
        where: {
          user_id: request.body.user_id,
        },
      });
    });

    return reply.status(200).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in adminDeleteUserHandler:", error);
    return reply.status(500).send({
      message: "Internal server error",
    });
  }
};
