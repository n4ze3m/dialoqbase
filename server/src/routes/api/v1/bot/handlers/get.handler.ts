import { FastifyReply, FastifyRequest } from "fastify";

import { GetBotRequestById } from "./types";

export const getBotByIdEmbeddingsHandler = async (
  request: FastifyRequest<GetBotRequestById>,
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

  const source = await prisma.botSource.count({
    where: {
      botId: id,
      isPending: true,
    },
  });

  return {
    inProgress: source > 0,
    public_id: bot.publicId,
  };
};

export const getBotByIdAllSourcesHandler = async (
  request: FastifyRequest<GetBotRequestById>,
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

  const sources = await prisma.botSource.findMany({
    where: {
      botId: id,
      type: {
        notIn: ["crawl", "sitemap"],
      },
    },
  });

  return {
    data: sources,
  };
};

export const getBotByIdHandler = async (
  request: FastifyRequest<GetBotRequestById>,
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
  return {
    data: bot,
  };
};

export const getAllBotsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;

  const bots = await prisma.bot.findMany({
    where: {
      user_id: request.user.user_id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      source: {
        distinct: ["type"],
        select: {
          type: true,
        },
      },
    },
  });

  return bots;
};

export const getCreateBotConfigHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const models = await prisma.dialoqbaseModels.findMany({
    where: {
      hide: false,
      deleted: false,
    },
  });

  const chatModel = models.map((model) => {
    return {
      label: model.name || model.model_id,
      value: model.model_id,
      stream: model.stream_available,
    };
  });

  const embeddingModel = [
    { value: "openai", label: "text-embedding-ada-002" },
    { value: "tensorflow", label: "tensorflow (cpu)" },
    { value: "cohere", label: "Cohere" },
    {
      value: "transformer",
      label: "all-MiniLM-L6-v2 (cpu)",
    },
    {
      value: "google-gecko",
      label: "Google text-gecko-001",
    },
    {
      value: "jina-api",
      label: "jina-embeddings-v2-base-en (API)",
    },
    {
      value: "jina",
      label: "jina-embeddings-v2-small-en (cpu)",
    },
  ];

  return {
    chatModel,
    embeddingModel,
  };
};

export const getBotByIdSettingsHandler = async (
  request: FastifyRequest<GetBotRequestById>,
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

  const models = await prisma.dialoqbaseModels.findMany({
    where: {
      hide: false,
      deleted: false,
    },
  });

  const chatModel = models.map((model) => {
    return {
      label: model.name || model.model_id,
      value: model.model_id,
      stream: model.stream_available,
    };
  });

  const embeddingModel = [
    { value: "openai", label: "text-embedding-ada-002" },
    { value: "tensorflow", label: "tensorflow (cpu)" },
    { value: "cohere", label: "Cohere" },
    {
      value: "transformer",
      label: "all-MiniLM-L6-v2 (cpu)",
    },
    {
      value: "google-gecko",
      label: "Google text-gecko-001",
    },
    {
      value: "jina-api",
      label: "jina-embeddings-v2-base-en (API)",
    },
    {
      value: "jina",
      label: "jina-embeddings-v2-small-en (cpu)",
    },
  ];

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }
  return {
    data: bot,
    chatModel,
    embeddingModel,
  };
};
