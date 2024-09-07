import { FastifyReply, FastifyRequest } from "fastify";

import { GetBotRequestById, GetDatasourceByBotId } from "./types";
import { getSettings } from "../../../../../utils/common";
import { getAllOllamaModels } from "../../../../../utils/ollama";

export const getBotByIdEmbeddingsHandler = async (
  request: FastifyRequest<GetBotRequestById>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user?.is_admin ? undefined : request.user?.user_id,
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

export const getDatasourceByBotId = async (
  request: FastifyRequest<GetDatasourceByBotId>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;
  const { limit, page } = request.query;
  const skip = (page - 1) * limit;
  const search = request.query.search;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user?.user_id,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }
  const [sources, totalCount] = await Promise.all([
    prisma.botSource.findMany({
      where: {
        botId: id,
        type: {
          notIn: ["crawl", "sitemap", "zip"],
        },
        OR: search
          ? [
            {
              content: search,
            },
          ]
          : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        document: true,
      },
    }),
    prisma.botSource.count({
      where: {
        botId: id,
        type: {
          notIn: ["crawl", "sitemap", "zip"],
        },
        OR: search
          ? [
            {
              content: search,
            },
          ]
          : undefined,
      },
    }),
  ]);

  return {
    data: sources,
    total: totalCount,
    next: page * limit < totalCount ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
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
      user_id: request.user?.is_admin ? undefined : request.user?.user_id,
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
      user_id: request.user?.user_id,
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
  const settings = await getSettings(prisma);

  const not_to_hide_providers = settings?.hideDefaultModels
    ? ["Local", "local", "ollama", "transformer", "Transformer"]
    : undefined;
  const models = await prisma.dialoqbaseModels.findMany({
    where: {
      hide: false,
      deleted: false,
      model_provider: {
        in: not_to_hide_providers,
      },
    },
  });

  const chatModel = models
    .filter((model) => model.model_type !== "embedding")
    .map((model) => {
      return {
        label: model.name || model.model_id,
        value: model.model_id,
        stream: model.stream_available,
      };
    });

  const embeddingModel = models
    .filter((model) => model.model_type === "embedding")
    .map((model) => {
      return {
        label: `${model.name || model.model_id} ${model.model_id === "dialoqbase_eb_dialoqbase-ollama"
          ? "(Deprecated)"
          : ""
          }`,
        value: model.model_id,
        disabled: model.model_id === "dialoqbase_eb_dialoqbase-ollama",
      };
    });
  if (settings?.dynamicallyFetchOllamaModels) {
    const ollamaModels = await getAllOllamaModels(settings.ollamaURL);
    chatModel.push(
      ...ollamaModels?.filter((model) => {
        return (
          !model?.details?.families?.includes("bert") &&
          !model?.details?.families?.includes("nomic-bert")
        );
      })
    );
    embeddingModel.push(
      ...ollamaModels.map((model) => ({ ...model, disabled: false }))
    );
  }

  return {
    chatModel,
    embeddingModel,
    defaultChatModel: settings?.defaultChatModel,
    defaultEmbeddingModel: settings?.defaultEmbeddingModel,
    fileUploadSizeLimit: settings?.fileUploadSizeLimit,
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
      user_id: request.user?.is_admin ? undefined : request.user?.user_id,
    },
  });
  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }
  const settings = await getSettings(prisma);

  const not_to_hide_providers = settings?.hideDefaultModels
    ? ["Local", "local", "ollama", "transformer", "Transformer"]
    : undefined;
  const models = await prisma.dialoqbaseModels.findMany({
    where: {
      hide: false,
      deleted: false,
      model_provider: {
        in: not_to_hide_providers,
      },
    },
  });

  const chatModel = models
    .filter((model) => model.model_type !== "embedding")
    .map((model) => {
      return {
        label: model.name || model.model_id,
        value: model.model_id,
        stream: model.stream_available,
      };
    });

  const embeddingModel = models
    .filter((model) => model.model_type === "embedding")
    .map((model) => {
      return {
        label: `${model.name || model.model_id} ${model.model_id === "dialoqbase_eb_dialoqbase-ollama"
          ? "(Deprecated)"
          : ""
          }`,
        value: model.model_id,
        disabled: model.model_id === "dialoqbase_eb_dialoqbase-ollama",
      };
    });
  if (settings?.dynamicallyFetchOllamaModels) {
    const ollamaModels = await getAllOllamaModels(settings.ollamaURL);
    chatModel.push(
      ...ollamaModels?.filter((model) => {
        return (
          !model?.details?.families?.includes("bert") &&
          !model?.details?.families?.includes("nomic-bert")
        );
      })
    );
    embeddingModel.push(
      ...ollamaModels.map((model) => ({ ...model, disabled: false }))
    );
  }
  return {
    data: bot,
    chatModel,
    embeddingModel,
  };
};

export const isBotReadyHandler = async (
  request: FastifyRequest<GetBotRequestById>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user?.is_admin ? undefined : request.user?.user_id,
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
    is_ready: source === 0,
  };
};
