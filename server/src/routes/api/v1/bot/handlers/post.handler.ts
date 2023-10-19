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
import { getSettings } from "../../../../../utils/common";
import {
  HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT,
  HELPFUL_ASSISTANT_WITHOUT_CONTEXT_PROMPT,
} from "../../../../../utils/prompts";

export const createBotHandler = async (
  request: FastifyRequest<CreateBotRequest>,
  reply: FastifyReply
) => {
  const {
    content,
    type,
    name: nameFromRequest,
    embedding,
    model,
  } = request.body;

  const prisma = request.server.prisma;

  // only non-admin users are affected by this settings
  const settings = await getSettings(prisma);
  const user = request.user;
  const isBotCreatingAllowed = settings?.allowUserToCreateBots;
  if (!user.is_admin && !isBotCreatingAllowed) {
    return reply.status(400).send({
      message: "Bot creation is disabled by admin",
    });
  }

  const totalBotsUserCreated = await prisma.bot.count({
    where: {
      user_id: request.user.user_id,
    },
  });

  const maxBotsAllowed = settings?.noOfBotsPerUser || 10;

  if (!user.is_admin && totalBotsUserCreated >= maxBotsAllowed) {
    return reply.status(400).send({
      message: `Reach maximum limit of ${maxBotsAllowed} bots per user`,
    });
  }

  const isEmbeddingsValid = apiKeyValidaton(embedding);

  if (!isEmbeddingsValid) {
    return reply.status(400).send({
      message: apiKeyValidatonMessage(embedding),
    });
  }

  // const providerName = modelProviderName(model);
  const modelInfo = await prisma.dialoqbaseModels.findFirst({
    where: {
      model_id: model,
      hide: false,
      deleted: false,
    },
  });

  if (!modelInfo) {
    return reply.status(400).send({
      message: "Model not found",
    });
  }

  const isAPIKeyAddedForProvider = apiKeyValidaton(
    `${modelInfo.model_provider}`.toLowerCase()
  );

  if (!isAPIKeyAddedForProvider) {
    return reply.status(400).send({
      message: apiKeyValidatonMessage(modelInfo.model_provider || ""),
    });
  }

  const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  });

  const name = nameFromRequest || shortName;

  const isStreamingAvilable = modelInfo.stream_available;
  console.log("isStreamingAvilable", isStreamingAvilable);

  if (content && type) {
    const bot = await prisma.bot.create({
      data: {
        name,
        embedding,
        model,
        provider: modelInfo.model_provider || "",
        streaming: isStreamingAvilable,
        user_id: request.user.user_id,
        haveDataSourcesBeenAdded: true,
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

    await request.server.queue.add([
      {
        ...botSource,
        embedding,
        maxDepth: request.body.maxDepth,
        maxLinks: request.body.maxLinks,
        options: request.body.options,
      },
    ]);
    return {
      id: bot.id,
    };
  } else {
    console.log("isStreamingAvilable", isStreamingAvilable);
    const bot = await prisma.bot.create({
      data: {
        name,
        embedding,
        model,
        provider: modelInfo.model_provider || "",
        streaming: isStreamingAvilable,
        user_id: request.user.user_id,
        haveDataSourcesBeenAdded: false,
        qaPrompt: HELPFUL_ASSISTANT_WITHOUT_CONTEXT_PROMPT,
      },
    });

    return {
      id: bot.id,
    };
  }
};

export const addNewSourceByIdHandler = async (
  request: FastifyRequest<AddNewSourceById>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const id = request.params.id;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
    },
    include: {
      source: true,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  const { content, type } = request.body;

  const botSource = await prisma.botSource.create({
    data: {
      content,
      type,
      botId: bot.id,
      options: request.body.options,
    },
  });

  if (bot.source.length === 0 && !bot.haveDataSourcesBeenAdded) {
    await prisma.bot.update({
      where: {
        id,
      },
      data: {
        haveDataSourcesBeenAdded: true,
        qaPrompt: HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT,
      },
    });
  }

  await request.server.queue.add([
    {
      ...botSource,
      embedding: bot.embedding,
      maxDepth: request.body.maxDepth,
      maxLinks: request.body.maxLinks,
      options: request.body.options,
    },
  ]);
  return {
    id: bot.id,
  };
};

export const refreshSourceByIdHandler = async (
  request: FastifyRequest<GetSourceByIds>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const bot_id = request.params.id;
  const source_id = request.params.sourceId;

  const bot = await prisma.bot.findFirst({
    where: {
      id: bot_id,
      user_id: request.user.user_id,
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
  await request.server.queue.add([
    {
      ...botSource,
      embedding: bot.embedding,
    },
  ]);

  return {
    id: bot.id,
  };
};
