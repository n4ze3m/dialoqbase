import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateBotById, UpdateBotAPIById } from "./types";
import {
  apiKeyValidaton,
  apiKeyValidatonMessage,
} from "../../../../../utils/validate";
import { getModelInfo } from "../../../../../utils/get-model-info";

export const updateBotByIdHandler = async (
  request: FastifyRequest<UpdateBotById>,
  reply: FastifyReply
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

  const modelInfo = await getModelInfo({
    model: request.body.model,
    prisma,
  });

  if (!modelInfo) {
    return reply.status(400).send({
      message: "Model not found",
    });
  }

  const isAPIKeyAddedForProvider = apiKeyValidaton(
    `${modelInfo.model_provider}`.toLocaleLowerCase()
  );

  if (!isAPIKeyAddedForProvider) {
    return reply.status(400).send({
      message: apiKeyValidatonMessage(modelInfo.model_provider || ""),
    });
  }

  if (!modelInfo.stream_available && request.body.streaming) {
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
      provider: modelInfo.model_provider || "",
    },
  });

  return {
    id: bot.id,
  };
};

export const updateBotAPIByIdHandler = async (
  request: FastifyRequest<UpdateBotAPIById>,
  reply: FastifyReply
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

  let updateBody: Record<string, any> = {
    ...request.body,
    qaPrompt: request.body?.system_prompt,
    questionGeneratorPrompt: request.body?.question_generator_prompt,
    system_prompt: undefined,
    question_generator_prompt: undefined,
  };

  if (updateBody.model) {
    const modelInfo = await getModelInfo({
      model: updateBody.model,
      prisma,
      type: "chat",
    });

    if (!modelInfo) {
      return reply.status(400).send({
        message: "Model not found",
      });
    }

    const isAPIKeyAddedForProvider = apiKeyValidaton(
      `${modelInfo.model_provider}`.toLocaleLowerCase()
    );

    if (!isAPIKeyAddedForProvider) {
      return reply.status(400).send({
        message: apiKeyValidatonMessage(modelInfo.model_provider || ""),
      });
    }

    if (!modelInfo.stream_available && request.body.streaming) {
      return reply.status(400).send({
        message: "Streaming is not supported for this model",
      });
    }
    updateBody = {
      ...updateBody,
      provider: modelInfo.model_provider || "",
    };
  }
  await prisma.bot.update({
    where: {
      id: bot.id,
    },
    data: updateBody,
  });

  return {
    id: bot.id,
  };
};
