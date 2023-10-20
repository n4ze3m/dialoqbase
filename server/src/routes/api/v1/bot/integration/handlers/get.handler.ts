import { FastifyReply, FastifyRequest } from "fastify";
import { GetChannelsByProviderType, GetIntergationType } from "./type";

export async function getChannelsByProvider(
  request: FastifyRequest<GetChannelsByProviderType>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
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
  let providerChannel: GetIntergationType[] = [
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
          defaultValue: "",
        },
      ],
      isPaused: false,
      status: "CONNECT",
      color: "#fff",
      textColor: "#000",
      connectBtn: null,
    },
    {
      name: "Discord (🧪)",
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
          defaultValue: "",
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
          defaultValue: "",
        },
        {
          name: "discord_slash_command",
          type: "string",
          inputType: "string",
          title: "Slash command",
          description: "Discord slash command",
          help: "Bot needs to have slash command",
          requiredMessage: "Slash command is required",
          value: "help",
          defaultValue: "help",
        },
        {
          name: "discord_slash_command_description",
          type: "string",
          inputType: "string",
          title: "Slash command description",
          description: "Discord slash command description",
          help: "A description for the slash command",
          requiredMessage: "Slash command description is required",
          value: "Use this command to send messages to the bot",
          defaultValue: "Use this command to send messages to the bot",
        },
        {
          name: "discord_show_sources",
          type: "boolean",
          inputType: "boolean",
          title: "Show URL sources",
          description: "Show sources in Discord command",
          help: "Show sources in Discord command",
          requiredMessage: "",
          value: false,
          defaultValue: false,
        },
        {
          name: "discord_smart_label",
          type: "string",
          inputType: "boolean",
          title: `Smart Source Label\n("https://en.wikipedia.org/wiki/Linux_kernel" => "Linux Kernel")`,
          description:
            "Let the system try to find a smart title for every source",
          help: "Let the system try to find a smart title for every source",
          requiredMessage: "",
          value: false,
          defaultValue: false,
        },
      ],
      isPaused: false,
      status: "CONNECT",
      color: "#fff",
      textColor: "#000",
      connectBtn: null,
    },
    {
      name: "WhatsApp (🧪)",
      channel: "whatsapp",
      logo: "/providers/whatsapp.svg",
      link: "https://developers.facebook.com/docs/whatsapp/guides",
      description:
        "Set up a WhatsApp bot from your knowledge base to send and receive messages",
      fields: [
        {
          name: "whatsapp_phone_number",
          type: "string",
          title: "WhatsApp phone number ID",
          inputType: "password",
          description: "WhatsApp phone number ID",
          help: "You can get it from WhatsApp Business API",
          requiredMessage: "WhatsApp phone number ID is required",
          value: "",
          defaultValue: "",
        },
        {
          name: "whatsapp_access_token",
          type: "string",
          title: "Access token",
          inputType: "password",
          description: "Access token",
          help: "You can get it from WhatsApp Business API",
          requiredMessage: "Access token is required",
          value: "",
          defaultValue: "",
        },
        {
          name: "whatsapp_verify_token",
          type: "string",
          title: "Verify token",
          inputType: "password",
          description: "Verify token",
          help: "A token to verify the webhook request",
          requiredMessage: "Verify token is required",
          value: "",
          defaultValue: "",
        },
        {
          name: "whatsapp_webhook_url",
          type: "webhook",
          title: "Webhook URL",
          inputType: "string",
          description: "Webhook URL",
          help: "A URL to receive webhook requests",
          requiredMessage: "Webhook URL is required",
          value: "",
          defaultValue: "",
        },
      ],
      isPaused: false,
      status: "CONNECT",
      color: "#fff",
      textColor: "#000",
      connectBtn: null,
    },
    // {
    //   name: "Slack (🧪)",
    //   channel: "slack",
    //   logo: "/providers/slack.svg",
    //   link: "https://api.slack.com/apps",
    //   description:
    //     "Set up a Slack bot from your knowledge base to send and receive messages",
    //   fields: [
    //     {
    //       name: "slack_auth_token",
    //       type: "string",
    //       title: "Auth token",
    //       inputType: "password",
    //       description: "Slack auth token",
    //       help: "You can get it from Slack API",
    //       requiredMessage: "Auth token is required",
    //       value: "",
    //       defaultValue: "",
    //     },
    //     {
    //       name: "slack_signing_secret",
    //       type: "string",
    //       title: "Signing secret",
    //       inputType: "password",
    //       description: "Slack signing secret",
    //       help: "You can get it from Slack API",
    //       requiredMessage: "Signing secret is required",
    //       value: "",
    //       defaultValue: "",
    //     },
    //     {
    //       name: "slack_app_token",
    //       type: "string",
    //       title: "App token",
    //       inputType: "password",
    //       description: "Slack app token",
    //       help: "You can get it from Slack API",
    //       requiredMessage: "App token is required",
    //       value: "",
    //       defaultValue: "",
    //     },
    //   ],
    //   isPaused: false,
    //   status: "CONNECT",
    //   color: "#fff",
    //   textColor: "#000",
    //   connectBtn: null,
    // },
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
            field.value = integration[field.name] || field.defaultValue;
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

          if (provider.status === "CONNECTED") {
            provider.connectBtn = {
              text: "Add to Discord",
              link:
                `https://discord.com/oauth2/authorize?client_id=${integration.discord_application_id}&scope=bot%20applications.commands&permissions=0`,
            };
          }
          break;

        case "whatsapp":
          for (const field of provider.fields) {
            if (field.type === "webhook") {
              field.value = bot.publicId;
            } else {
              // @ts-ignore
              field.value = integration[field.name] || field.defaultValue;
            }
          }

          provider.status = integration.whatsapp_phone_number
            ? "CONNECTED"
            : "CONNECT";
          provider.color = integration.whatsapp_phone_number
            ? "rgb(134 239 172)"
            : "#fff";

          provider.textColor = integration.whatsapp_phone_number
            ? "#fff"
            : "#000";

          if (integration.is_pause && integration.whatsapp_phone_number) {
            provider.status = "PAUSED";
            provider.color = "rgb(225 29 72)";
            provider.textColor = "#fff";
          }

          // if (provider.status === "CONNECTED") {
          //   // provider.connectBtn = {
          //   //   text: "Connect to WhatsApp",
          //   //   link:
          //   //     `https://wa.me/${integration.whatsapp_phone_number}`,
          //   // };
          // }
          break;

        case "slack":
          for (const field of provider.fields) {
            // @ts-ignore
            field.value = integration[field.name] || field.defaultValue;
          }
          provider.status = integration.slack_auth_token
            ? "CONNECTED"
            : "CONNECT";
          provider.color = integration.slack_auth_token
            ? "rgb(134 239 172)"
            : "#fff";
          provider.textColor = integration.slack_auth_token ? "#fff" : "#000";

          if (integration.is_pause && integration.slack_auth_token) {
            provider.status = "PAUSED";
            provider.color = "rgb(225 29 72)";
            provider.textColor = "#fff";
          }

          if (provider.status === "CONNECTED") {
            provider.connectBtn = {
              text: "Add to Slack",
              link:
                `https://slack.com/oauth/v2/authorize?client_id=${integration.slack_auth_token}&scope=commands`,
            };
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
