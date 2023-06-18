export const CHANNELS = [
  "telegram",
];

export const geProviderRequiredFields = (channel: string) => {
  switch (channel) {
    case "telegram":
      return ["telegram_bot_token"];
    default:
      return null;
  }
};
