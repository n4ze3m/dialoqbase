import { FastifyReply, FastifyRequest } from "fastify";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";


import { CreateBotRequest } from "./types";

export const createBotHandler = async (
  request: FastifyRequest<CreateBotRequest>,
  reply: FastifyReply,
) => {
  const {
    content,
    type,
    name: nameFromRequest,
  } = request.body;

  const prisma = request.server.prisma;
  // const queue = request.server.queue;

  const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  });

  const name = nameFromRequest || shortName;

  const bot = await prisma.bot.create({
    data: {
      name,
    },
  });

  const botSource = await prisma.botSource.create({
    data: {
      content,
      type,
      botId: bot.id,
    },
  });

  await request.server.queue.add([botSource]);
  return {
    id: bot.id,
  };
};
