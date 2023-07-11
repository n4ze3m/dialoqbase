import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { GoogleChatBison } from "../models/bison";

export const chatModelProvider = (
  provider: string,
  modelName: string,
  temperature: number,
  otherFields?: any,
) => {
  switch (provider) {
    case "openai":
      console.log("using openai");
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
        // streaming: otherFields?.streaming,
        // callbacks: otherFields?.callbacks,
        ...otherFields,
      });
    case "anthropic":
      console.log("using anthropic");
      return new ChatAnthropic({
        modelName: modelName,
        temperature: temperature,
        ...otherFields,
      });
    case "google-bison":
      console.log("using google-bison");
      return new GoogleChatBison({
        temperature: temperature,
        ...otherFields,
      });
    default:
      console.log("using default");
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
        ...otherFields,
      });
  }
};

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
