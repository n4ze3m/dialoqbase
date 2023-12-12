import { FastifyReply, FastifyRequest } from "fastify";
import { GetAPIIntergationRequest } from "./type";
import { generateAPIKey } from "../../../../../../utils/api";


export const getAPIIntegrationHandler = async (
  request: FastifyRequest<GetAPIIntergationRequest>,
  reply: FastifyReply,
) => {
  try {
    const prisma = request.server.prisma;
    const id = request.params.id;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        user_id: request.user.user_id,
      },
    });

    if (!bot) {
      return reply.status(404).send({
        message: "Bot not found",
      });
    }

    if (!bot.bot_api_key) {
      return {
        is_api_enabled: false,
        data: {
          public_url: null,
          api_key: null,
        },
      };
    }

    return {
      is_api_enabled: true,
      data: {
        public_url: bot.publicId,
        api_key: bot.bot_api_key,
      },
    };
  } catch (e) {
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const generateAPIKeyHandler = async (
  request: FastifyRequest<GetAPIIntergationRequest>,
  reply: FastifyReply,
) => {
  try {
    const prisma = request.server.prisma;
    const id = request.params.id;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        user_id: request.user.user_id,
      },
    });

    if (!bot) {
      return reply.status(404).send({
        message: "Bot not found",
      });
    }

    const bot_api_key = generateAPIKey();

    await prisma.bot.update({
      where: {
        id,
      },
      data: {
        bot_api_key,
      },
    });

    return {
      data: {
        bot_api_key,
      },
    };
  } catch (e) {
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const regenerateAPIKeyHandler = async (
  request: FastifyRequest<GetAPIIntergationRequest>,
  reply: FastifyReply,
) => {
  try {
    const prisma = request.server.prisma;
    const id = request.params.id;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        user_id: request.user.user_id,
      },
    });

    if (!bot) {
      return reply.status(404).send({
        message: "Bot not found",
      });
    }

    const bot_api_key = generateAPIKey();

    await prisma.bot.update({
      where: {
        id,
      },
      data: {
        bot_api_key,
      },
    });

    return {
      data: {
        bot_api_key,
      },
    };
  } catch (e) {
    console.log(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
