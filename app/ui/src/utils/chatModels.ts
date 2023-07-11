export const availableChatModels = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (OpenAI)" },
  { value: "gpt-3.5-turbo-16k", label: "GPT-3.5 Turbo 16K (OpenAI)" },
  { value: "gpt-4", label: "GPT-4 (OpenAI)" },
  { value: "gpt-4-0613", label: "GPT-4 0613 (OpenAI)" },
  { value: "claude-1", label: "Claude 1 (Anthropic)" },
  { value: "claude-2", label: "Claude 2 (Anthropic)" },
  { value: "claude-instant-1", label: "Claude Instant (Anthropic)" },
  {
    value: "google-bison",
    label: "Google chat-bison-001 (beta)",
  },
];

export const streamingSupportedModels = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-4",
  "gpt-4-0613",
  "claude-1",
  "claude-instant-1",
  "claude-2",
];

export const isStreamingSupported = (model: string) => {
  return streamingSupportedModels.includes(model);
};
