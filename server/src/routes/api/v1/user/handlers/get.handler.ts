import { FastifyReply, FastifyRequest } from "fastify";
import { getSettings } from "../../../../../utils/common";

export const isRegisterationAllowedHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const settings = await getSettings(prisma);

  return {
    isRegistrationAllowed: settings?.allowUserToRegister || false,
  };
};

export const meHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const user = await prisma.user.findUnique({
    where: {
      user_id: request.user.user_id,
    },
  });

  if (!user) {
    return reply.status(404).send({
      message: "User not found",
    });
  }

  return {
    id: user.user_id,
    username: user.username,
    email: user.email,
  };
};
