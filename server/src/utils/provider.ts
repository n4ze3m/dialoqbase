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
    default:
      return "Unknown";
  }
};
