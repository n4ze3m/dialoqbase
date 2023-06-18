import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import TelegramBot from "../integration/telegram";

const integrationPlugin: FastifyPluginAsync = fp(async (server, options) => {
  console.log("Connecting pm2...");
  const prisma = new PrismaClient();
  const pendingProcess = await prisma.botIntegration.findMany({
    where: {
      is_pause: false,
      telegram_bot_token: {
        not: null,
      },
    },
  });

  pendingProcess.forEach(async (process) => {
    // make switch later
    if (process.provider === "telegram") {
      await TelegramBot.connect(
        process.identifier,
        process.telegram_bot_token!,
      );
    }
  });
});

export default integrationPlugin;
