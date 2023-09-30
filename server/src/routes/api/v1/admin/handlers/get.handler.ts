import { FastifyReply, FastifyRequest } from "fastify";
import { getSettings } from "../../../../../utils/common";

export const dialoqbaseSettingsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const user = request.user;

  if (!user.is_admin) {
    return reply.status(403).send({
      message: "Forbidden",
    });
  }

  const settings = await getSettings(prisma);

  if (!settings) {
    return reply.status(404).send({
      message: "Settings not found",
    });
  }

  return settings;
};
