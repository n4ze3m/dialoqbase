export const modelProviderName = (model: string) => {
  switch (model) {
    case "gpt-3.5-turbo":
      return "openai";
    case "gpt-3.5-turbo-16k":
      return "openai";
    case "gpt-4":
      return "openai";
    case "gpt-4-0613":
      return "openai";
    case "claude-1":
      return "anthropic";
    case "claude-instant-1":
      return "anthropic";
    case "claude-2":
      console.log("claude-2");
      return "anthropic";
    case "google-bison":
      return "google-bison";
    default:
      return "Unknown";
  }
};
