export const modelProviderName = (model: string) => {
  switch (model) {
    case "gpt-3.5-turbo":
    case "gpt-3.5-turbo-16k":
    case "gpt-4":
    case "gpt-4-0613":
      return "openai";
    case "claude-1":
      return "anthropic";
    case "claude-instant-1":
      return "anthropic";
    case "claude-2":
      return "anthropic";
    case "google-bison":
      return "google-bison";
    case "falcon-7b-instruct-inference":
      return "huggingface-api";
    case "llama-v2-7b-chat":
      return "fireworks";
    case "llama-v2-13b-chat":
      return "fireworks";
    case "llama-v2-70b-chat":
      return "fireworks";
    case "llama-v2-7b-chat-w8a16":
      return "fireworks";
    case "llama-v2-13b-chat-w8a16":
      return "fireworks";
    case "llama-v2-13b-code-instruct":
      return "fireworks";
    case "llama-v2-34b-code-instruct-w8a16":
      return "fireworks";
    case "gpt-3.5-turbo-instruct":
      return "openai-instruct";
    case "mistral-7b-instruct-4k":
      return "fireworks";
    default:
      return "Unknown";
  }
};
