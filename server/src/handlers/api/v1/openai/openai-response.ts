import { randomUUID } from "node:crypto";

export const openaiNonStreamResponse = (message: string, model: string) => {
  return {
    id: randomUUID(),
    created: new Date().toISOString(),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: message,
        },
      },
    ],
    object: "chat.completion",
  };
};

export const openaiStreamResponse = (message: string, model: string) => {
  return JSON.stringify({
    id: randomUUID(),
    created: new Date().toISOString(),
    model,
    object: "chat.completion.chunk",
    choices: [
      {
        delta: {
          content: message,
        },
      },
    ],
  });
};
