import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateBotById } from "./types";
import { modelProviderName } from "../../../../../utils/provider";
import {
  apiKeyValidaton,
  apiKeyValidatonMessage,
} from "../../../../../utils/validate";
import { isStreamingSupported } from "../../../../../utils/models";

export const updateBotByIdHandler = async (
  request: FastifyRequest<UpdateBotById>,
  reply: FastifyReply,
) => {
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

  const providerName = modelProviderName(request.body.model);

  const isModelValid = providerName !== "Unknown";

  if (!isModelValid) {
    return reply.status(400).send({
      message: "Model not found",
    });
  }

  const isAPIKeyAddedForProvider = apiKeyValidaton(providerName);

  if (!isAPIKeyAddedForProvider) {
    return reply.status(400).send({
      message: apiKeyValidatonMessage(providerName),
    });
  }


  if (!isStreamingSupported(request.body.model) && request.body.streaming) {
    return reply.status(400).send({
      message: "Streaming is not supported for this model",
    });
  }


  await prisma.bot.update({
    where: {
      id: bot.id,
    },
    data: {
      ...request.body,
      provider: providerName,
    },
  });

  return {
    id: bot.id,
  };
};
