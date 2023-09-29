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
