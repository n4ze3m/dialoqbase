import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateDialoqbaseSettingsRequest } from "./type";
import { getSettings } from "../../../../../utils/common";

export const updateDialoqbaseSettingsHandler = async (
  request: FastifyRequest<UpdateDialoqbaseSettingsRequest>,
  reply: FastifyReply,
) => {
  const primsa = request.server.prisma;
  const user = request.user;

  if (!user.is_admin) {
    return reply.status(403).send({
      message: "Forbidden",
    });
  }

  const settings = await getSettings(primsa);
  if (!settings) {
    return reply.status(404).send({
      message: "Settings not found",
    });
  }

  await primsa.dialoqbaseSettings.update({
    where: {
      id: 1,
    },
    data: request.body,
  });

  return {
    message: "Application settings updated successfully",
  };
};
