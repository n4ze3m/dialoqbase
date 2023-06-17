export const providers = [
  {
    name: "Telegram",
    channel: "telegram",
    logo: "/providers/telegram.svg",
    description:
      "Telegram is a cloud-based instant messaging and voice over IP service.",
    fields: [
      {
        name: "telegram_bot_token",
        type: "string",
        title: "Bot token",
        description: "Telegram bot token",
        help: "You can get it from @BotFather",
        requiredMessage: "Bot token is required",
        value: "",
      },
    ],
    isPaused: false,
    status: "CONNECT",
    color: "#ffffff",
  },
];
