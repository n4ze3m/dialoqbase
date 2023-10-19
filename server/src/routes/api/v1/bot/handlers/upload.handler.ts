import { FastifyReply, FastifyRequest } from "fastify";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

import { AddNewPDFById, UploadPDF } from "./types";
import * as fs from "fs";
import * as util from "util";
import { pipeline } from "stream";
import { randomUUID } from "crypto";
import {
  apiKeyValidaton,
  apiKeyValidatonMessage,
} from "../../../../../utils/validate";
const pump = util.promisify(pipeline);
import { fileTypeFinder } from "../../../../../utils/fileType";
import { getSettings } from "../../../../../utils/common";
import { HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT } from "../../../../../utils/prompts";

export const createBotFileHandler = async (
  request: FastifyRequest<UploadPDF>,
  reply: FastifyReply
) => {
  try {
    const embedding = request.query.embedding;
    const model = request.query.model;
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
      `${modelInfo.model_provider}`.toLocaleLowerCase()
    );

    if (!isAPIKeyAddedForProvider) {
      return reply.status(400).send({
        message: apiKeyValidatonMessage(
          `${modelInfo.model_provider}`.toLocaleLowerCase()
        ),
      });
    }

    const name = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
    });

    const isStreamingAvilable = modelInfo.stream_available;

    const bot = await prisma.bot.create({
      data: {
        name,
        embedding,
        model,
        provider: modelInfo.model_provider || "",
        streaming: isStreamingAvilable,
        user_id: request.user.user_id,
      },
    });

    const files = request.files();

    for await (const file of files) {
      const fileName = `${randomUUID()}-${file.filename}`;
      const path = `./uploads/${fileName}`;
      await fs.promises.mkdir("./uploads", { recursive: true });
      await pump(file.file, fs.createWriteStream(path));
      const type = fileTypeFinder(file.mimetype);

      const botSource = await prisma.botSource.create({
        data: {
          content: file.filename,
          type,
          botId: bot.id,
          location: path,
        },
      });

      await request.server.queue.add([
        {
          ...botSource,
          embedding: bot.embedding,
        },
      ]);
    }

    return reply.status(200).send({
      id: bot.id,
    });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({
      message: "Upload failed due to internal server error",
    });
  }
};

export const addNewSourceFileByIdHandler = async (
  request: FastifyRequest<AddNewPDFById>,
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

  const files = request.files();

  for await (const file of files) {
    const fileName = `${randomUUID()}-${file.filename}`;
    const path = `./uploads/${fileName}`;
    await fs.promises.mkdir("./uploads", { recursive: true });
    await pump(file.file, fs.createWriteStream(path));
    const type = fileTypeFinder(file.mimetype);

    const botSource = await prisma.botSource.create({
      data: {
        content: file.filename,
        type,
        location: path,
        botId: id,
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
      },
    ]);
  }

  return {
    id: bot.id,
  };
};
