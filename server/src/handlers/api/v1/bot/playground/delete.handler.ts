import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteBotByPlaygroundId } from "./types";

export const deleteBotByPlaygroundId = async (
  request: FastifyRequest<DeleteBotByPlaygroundId>,
  reply: FastifyReply
) => {
  const user = request.user;
  const { id } = request.params;

  const prisma = request.server.prisma;

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
  await prisma.botPlaygroundMessage.deleteMany({
    where: {
      botPlaygroundId: id,
    },
  });

  await prisma.botPlayground.delete({
    where: {
      id,
    },
  });

  return reply.status(200).send({
    message: "Playground deleted",
  });
};
