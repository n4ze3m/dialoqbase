export const availableChatModels = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (OpenAI)" },
  { value: "gpt-3.5-turbo-16k", label: "GPT-3.5 Turbo 16K (OpenAI)" },
  { value: "gpt-4", label: "GPT-4 (OpenAI)" },
  { value: "gpt-4-0613", label: "GPT-4 0613 (OpenAI)" },
  {
    value: "gpt-3.5-turbo-instruct",
    label: "GPT-3.5 Turbo Instruct (OpenAI)",
  },
  { value: "claude-1", label: "Claude 1 (Anthropic)" },
  { value: "claude-2", label: "Claude 2 (Anthropic)" },
  { value: "claude-instant-1", label: "Claude Instant (Anthropic)" },
  {
    value: "google-bison",
    label: "Google chat-bison-001",
  },
  {
    value: "llama-v2-7b-chat",
    label: "Llama v2 7B (Fireworks)",
  },
  {
    value: "llama-v2-13b-chat",
    label: "Llama v2 13B (Fireworks)",
  },
  {
    value: "llama-v2-70b-chat",
    label: "Llama v2 70B (Fireworks)",
  },
  {
    value: "llama-v2-7b-chat-w8a16",
    label: "Llama v2 7B Chat int8 (Fireworks)",
  },
  {
    value: "llama-v2-13b-chat-w8a16",
    label: "Llama v2 13B Chat int8 (Fireworks)",
  },
  {
    value: "llama-v2-13b-code-instruct",
    label: "Llama v2 13B Code Instruct (Fireworks)",
  },
  {
    value: "llama-v2-34b-code-instruct-w8a16",
    label: "Llama v2 34B Code Instruct int8 (Fireworks)",
  },
  {
    value: "mistral-7b-instruct-4k",
    label: "Mistral 7B Instruct 4K (Fireworks)",
  }
];

export const streamingSupportedModels = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-4",
  "gpt-4-0613",
  "claude-1",
  "claude-instant-1",
  "claude-2",
  "llama-v2-7b-chat",
  "llama-v2-13b-chat",
  "llama-v2-70b-chat",
  "llama-v2-7b-chat-w8a16",
  "llama-v2-13b-chat-w8a16",
  "llama-v2-13b-code-instruct",
  "llama-v2-34b-code-instruct-w8a16",
  "gpt-3.5-turbo-instruct",
  "mistral-7b-instruct-4k",
];

export const isStreamingSupported = (model: string) => {
  return streamingSupportedModels.includes(model);
};
