import { FastifyReply, FastifyRequest } from "fastify";
import { GetChannelsByProviderType } from "./type";

export async function getChannelsByProvider(
  request: FastifyRequest<GetChannelsByProviderType>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  console.log("bot id", id);
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findUnique({
    where: {
      id,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: "Bot not found",
    });
  }

  let channels: any = [];
  let providerChannel = [
    {
      name: "Telegram",
      channel: "telegram",
      logo: "/providers/telegram.svg",
      link: "https://core.telegram.org/bots#how-do-i-create-a-bot",
      description:
        "Set up a Telegram bot from your knowledge base to send and receive messages",
      fields: [
        {
          name: "telegram_bot_token",
          type: "string",
          title: "Bot token",
          inputType: "password",
          description: "Telegram bot token",
          help: "You can get it from @BotFather",
          requiredMessage: "Bot token is required",
          value: "",
        },
      ],
      isPaused: false,
      status: "CONNECT",
      color: "#fff",
      textColor: "#000",
    },
    {
      name: "Discord",
      channel: "discord",
      logo: "/providers/discord.svg",
      link: "https://discord.com/developers/applications",
      description:
        "Set up a Discord bot from your knowledge base to send and receive messages",
      fields: [
        {
          name: "discord_application_id",
          type: "string",
          title: "Application ID",
          inputType: "password",
          description: "Discord application ID",
          help: "You can get it from Discord Developer Portal",
          requiredMessage: "Application ID is required",
          value: "",
        },
        {
          name: "discord_bot_token",
          type: "string",
          title: "Bot token",
          inputType: "password",
          description: "Discord bot token",
          help: "You can get it from Discord Developer Portal",
          requiredMessage: "Bot token is required",
          value: "",
        },
        {
          name: "discord_slash_command",
          type: "string",
          inputType: "string",
          title: "Slash command",
          description: "Discord slash command",
          help: "User will use this command to send message to discord bot",
          requiredMessage: "Slash command is required",
          value: "",
        },
        {
          name: "discord_slash_command_description",
          type: "string",
          inputType: "string",
          title: "Slash command description",
          description: "Discord slash command description",
          help: "It will be used to send messages from your knowledge base",
          requiredMessage: "Slash command description is required",
          value: "",
        },
      ],
      isPaused: false,
      status: "CONNECT",
      color: "#fff",
      textColor: "#000",
    },
  ];

  for (const provider of providerChannel) {
    const integration = await prisma.botIntegration.findFirst({
      where: {
        bot_id: id,
        provider: provider.channel,
      },
    });
    console.log(integration);
    if (integration) {
      switch (provider.channel) {
        case "telegram":
          provider.status = integration.telegram_bot_token
            ? "CONNECTED"
            : "CONNECT";
          provider.color = integration.telegram_bot_token
            ? "rgb(134 239 172)"
            : "#fff";
          provider.textColor = integration.telegram_bot_token ? "#fff" : "#000";

          if (integration.is_pause && integration.telegram_bot_token) {
            provider.status = "PAUSED";
            provider.color = "rgb(225 29 72)";
            provider.textColor = "#fff";
          }
          provider.fields[0].value = integration.telegram_bot_token || "";
          break;

        case "discord":
          for (const field of provider.fields) {
            // @ts-ignore
            field.value = integration[field.name] || "";
          }
          provider.status = integration.discord_bot_token
            ? "CONNECTED"
            : "CONNECT";
          provider.color = integration.discord_bot_token
            ? "rgb(134 239 172)"
            : "#fff";
          provider.textColor = integration.discord_bot_token ? "#fff" : "#000";

          if (integration.is_pause && integration.discord_bot_token) {
            provider.status = "PAUSED";
            provider.color = "rgb(225 29 72)";
            provider.textColor = "#fff";
          }
          break;
        default:
          break;
      }
      provider.isPaused = integration.is_pause || false;
    }

    channels.push(provider);
  }

  return {
    "data": channels,
  };
}
