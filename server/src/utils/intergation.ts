export const CHANNELS = [
  "telegram",
  "discord",
];

export const geProviderRequiredFields = (channel: string) => {
  switch (channel) {
    case "telegram":
      return ["telegram_bot_token"];
    case "discord":
      return [
        "discord_bot_token",
        "discord_application_id",
        "discord_slash_command",
        "discord_slash_command_description",
      ];
    default:
      return null;
  }
};
