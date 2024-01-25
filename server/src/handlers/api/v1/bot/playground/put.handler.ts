import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateBotPlaygroundTitleById } from "./types";

export const updateBotPlaygroundTitleById = async (
  request: FastifyRequest<UpdateBotPlaygroundTitleById>,
  reply: FastifyReply
) => {
  const user = request.user;
  const prisma = request.server.prisma;

  const { title } = request.body;
  const { id } = request.params;

  const isRealOwner = await prisma.botPlayground.findFirst({
    where: {
      id,
      Bot: {
        user_id: user.user_id,
      },
    },
  });

  if (!isRealOwner) {
    return reply.status(404).send({
      message: "Playground not found",
    });
  }

  await prisma.botPlayground.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });

  return reply.status(200).send({
    message: "Playground updated",
  });
};
