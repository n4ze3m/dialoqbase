import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import TelegramBot from "../integration/telegram";
import DiscordBot from "../integration/discord";
import WhatsappBot from "../integration/whatsapp";
// import SlackBot from "../integration/slack";

const integrationPlugin: FastifyPluginAsync = fp(async (server, options) => {
  console.log("Connecting integration...");
  const prisma = new PrismaClient();
  const pendingProcess = await prisma.botIntegration.findMany({
    where: {
      is_pause: false,
    },
  include: {
    Bot: true
  }
  });

  pendingProcess.forEach(async (process) => {
    // make switch later
    if (process.provider === "telegram") {
      await TelegramBot.connect(
        process.identifier,
        process.telegram_bot_token!,
      );
    } else if (process.provider === "discord") {
      await DiscordBot.connect(
        process.identifier,
        process.discord_bot_token!,
        process.discord_slash_command!,
        process.discord_slash_command_description!,
        process.discord_show_sources!,
        process.discord_smart_label!,
      );
    } else if (process.provider === "whatsapp") {
      await WhatsappBot.connect(
        process.bot_id,
        process.whatsapp_phone_number!,
        process.whatsapp_access_token!,
      )
    }

    // else if (process.provider === "slack") {
    //   await SlackBot.connect(
    //     process.identifier,
    //     process.slack_auth_token!,
    //     process.slack_signing_secret!,
    //     process.slack_app_token!,
    //   )
    // }
  });
});

export default integrationPlugin;
