export const CHANNELS = [
  "telegram",
  "discord",
  "whatsapp",
  "slack",
  "website"
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
        "discord_show_sources",
        "discord_smart_label",
      ];
    case "whatsapp":
      return [
        "whatsapp_phone_number",
        "whatsapp_verify_token",
        "whatsapp_access_token",
      ];
    case "slack":
      return [
        "slack_auth_token",
        "slack_signing_secret",
        "slack_app_token"
      ];
    default:
      return null;
  }
};
