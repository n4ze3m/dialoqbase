import { FastifyReply, FastifyRequest } from "fastify";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

import { AddNewSourceById, CreateBotRequest, GetSourceByIds } from "./types";
import {
  apiKeyValidaton,
  apiKeyValidatonMessage,
} from "../../../../../utils/validate";
import { modelProviderName } from "../../../../../utils/provider";
import { isStreamingSupported } from "../../../../../utils/models";

export const createBotHandler = async (
  request: FastifyRequest<CreateBotRequest>,
  reply: FastifyReply,
) => {
  const {
    content,
    type,
    name: nameFromRequest,
    embedding,
    model,
  } = request.body;

  const prisma = request.server.prisma;

  const isEmbeddingsValid = apiKeyValidaton(embedding);

  if (!isEmbeddingsValid) {
    return reply.status(400).send({
      message: apiKeyValidatonMessage(embedding),
    });
  }

  const providerName = modelProviderName(model);

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

  const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  });

  const name = nameFromRequest || shortName;

  const isStreamingAvilable = isStreamingSupported(request.body.model);

  const bot = await prisma.bot.create({
    data: {
      name,
      embedding,
      model,
      provider: providerName,
      streaming: isStreamingAvilable,
    },
  });

  const botSource = await prisma.botSource.create({
    data: {
      content,
      type,
      botId: bot.id,
      options: request.body.options,
    },
  });

  await request.server.queue.add([{
    ...botSource,
    embedding,
    maxDepth: request.body.maxDepth,
    maxLinks: request.body.maxLinks,
    options: request.body.options,
  }]);
  return {
    id: bot.id,
  };
};

export const addNewSourceByIdHandler = async (
  request: FastifyRequest<AddNewSourceById>,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const bot = await prisma.bot.findUnique({
    where: {
      id,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const {
    content,
    type,
  } = request.body;

  const botSource = await prisma.botSource.create({
    data: {
      content,
      type,
      botId: bot.id,
      options: request.body.options,
    },
  });

  await request.server.queue.add([{
    ...botSource,
    embedding: bot.embedding,
    maxDepth: request.body.maxDepth,
    maxLinks: request.body.maxLinks,
    options: request.body.options,
  }]);
  return {
    id: bot.id,
  };
};

export const refreshSourceByIdHandler = async (
  request: FastifyRequest<GetSourceByIds>,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const bot_id = request.params.id;
  const source_id = request.params.sourceId;

  const bot = await prisma.bot.findUnique({
    where: {
      id: bot_id,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const botSource = await prisma.botSource.findFirst({
    where: {
      id: source_id,
      botId: bot.id,
    },
  });

  if (!botSource) {
    return reply.status(404).send({
      message: "Source not found",
    });
  }

  await prisma.botSource.update({
    where: {
      id: source_id,
    },
    data: {
      isPending: true,
      status: "pending",
    },
  });

  await prisma.botDocument.deleteMany({
    where: {
      botId: bot.id,
      sourceId: source_id,
    },
  });
  await request.server.queue.add([{
    ...botSource,
    embedding: bot.embedding,
  }]);

  return {
    id: bot.id,
  };
};
