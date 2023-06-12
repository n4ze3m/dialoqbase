import { FastifyReply, FastifyRequest } from "fastify";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

import {
  AddNewPDFById,
  AddNewSourceById,
  CreateBotRequest,
  GetBotRequestById,
  GetSourceByIds,
  UpdateBotById,
  UploadPDF,
} from "./types";
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

  const bot = await prisma.bot.create({
    data: {
      name,
      embedding,
      model,
      provider: providerName,
    },
  });

  const botSource = await prisma.botSource.create({
    data: {
      content,
      type,
      botId: bot.id,
    },
  });

  await request.server.queue.add([{
    ...botSource,
    embedding,
    maxDepth: request.body.maxDepth,
    maxLinks: request.body.maxLinks,
  }]);
  return {
    id: bot.id,
  };
};

export const createBotPDFHandler = async (
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

    const prisma = request.server.prisma;

    const file = await request.file();

    if (!file) {
      return reply.status(400).send({
        message: "File not found",
      });
    }
    const fileName = `${randomUUID()}-${file.filename}`;
    const path = `./uploads/${fileName}`;
    await fs.promises.mkdir("./uploads", { recursive: true });
    await pump(file.file, fs.createWriteStream(path));

    const name = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
    });

    const bot = await prisma.bot.create({
      data: {
        name,
        embedding,
        model,
        provider: providerName,
      },
    });

    const botSource = await prisma.botSource.create({
      data: {
        content: file.filename,
        type: "PDF",
        botId: bot.id,
        location: path,
      },
    });

    await request.server.queue.add([{
      ...botSource,
      embedding: bot.embedding,
    }]);

    return reply.status(200).send({
      id: bot.id,
    });
  } catch (err) {
    return reply.status(500).send({
      message: "Upload failed due to internal server error",
    });
  }
};

export const getBotByIdEmbeddingsHandler = async (
  request: FastifyRequest<GetBotRequestById>,
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

  const sources = await prisma.botSource.findMany({
    where: {
      botId: id,
      type: {
        not: "crawl",
      },
    },
  });

  return {
    data: sources,
  };
};

export const getBotByIdHandler = async (
  request: FastifyRequest<GetBotRequestById>,
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
  return {
    data: bot,
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
    },
  });

  await request.server.queue.add([{
    ...botSource,
    embedding: bot.embedding,
    maxDepth: request.body.maxDepth,
    maxLinks: request.body.maxLinks,
  }]);
  return {
    id: bot.id,
  };
};

export const addNewSourcePDFByIdHandler = async (
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

  const file = await request.file();

  if (!file) {
    return reply.status(400).send({
      message: "File not found",
    });
  }
  const fileName = `${randomUUID()}-${file.filename}`;
  const path = `./uploads/${fileName}`;
  await fs.promises.mkdir("./uploads", { recursive: true });
  await pump(file.file, fs.createWriteStream(path));

  const botSource = await prisma.botSource.create({
    data: {
      content: file.filename,
      type: "PDF",
      location: path,
      botId: id,
    },
  });

  await request.server.queue.add([{
    ...botSource,
    embedding: bot.embedding,
  }]);

  return {
    id: botSource.id,
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

export const deleteSourceByIdHandler = async (
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

  if (botSource.isPending) {
    return reply.status(400).send({
      message: "Source is in progress",
    });
  }

  await prisma.botDocument.deleteMany({
    where: {
      botId: bot.id,
      sourceId: source_id,
    },
  });

  await prisma.botSource.delete({
    where: {
      id: source_id,
    },
  });

  return {
    id: bot.id,
  };
};

export const deleteBotByIdHandler = async (
  request: FastifyRequest<GetBotRequestById>,
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

  await prisma.botDocument.deleteMany({
    where: {
      botId: bot.id,
    },
  });

  await prisma.botSource.deleteMany({
    where: {
      botId: bot.id,
    },
  });

  await prisma.bot.delete({
    where: {
      id: bot.id,
    },
  });

  return {
    message: "Bot deleted",
  };
};

export const updateBotByIdHandler = async (
  request: FastifyRequest<UpdateBotById>,
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

  console.log("providerName", providerName);

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

export const getAllBotsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;

  const bots = await prisma.bot.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return bots;
};
