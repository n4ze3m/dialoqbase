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
import { modelProviderName } from "../../../../../utils/provider";
const pump = util.promisify(pipeline);
import { fileTypeFinder } from "../../../../../utils/fileType";
import { isStreamingSupported } from "../../../../../utils/models";

export const createBotFileHandler = async (
  request: FastifyRequest<UploadPDF>,
  reply: FastifyReply,
) => {
  try {
    const embedding = request.query.embedding;
    const model = request.query.model;
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
    const name = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
    });

    const prisma = request.server.prisma;
    const isStreamingAvilable = isStreamingSupported(model);

    const bot = await prisma.bot.create({
      data: {
        name,
        embedding,
        model,
        provider: providerName,
        streaming: isStreamingAvilable,
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

      await request.server.queue.add([{
        ...botSource,
        embedding: bot.embedding,
      }]);
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

    await request.server.queue.add([{
      ...botSource,
      embedding: bot.embedding,
    }]);
  }

  return {
    id: bot.id,
  };
};
