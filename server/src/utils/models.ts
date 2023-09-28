import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatGooglePaLM } from "langchain/chat_models/googlepalm";
import { HuggingFaceInference } from "langchain/llms/hf";
import { DialoqbaseFireworksModel } from "../models/fireworks";
import { OpenAI } from "langchain/llms/openai";

export const chatModelProvider = (
  provider: string,
  modelName: string,
  temperature: number,
  otherFields?: any,
) => {
  console.log("provider", provider);
  console.log("modelName", modelName);
  switch (provider) {
    case "openai":
      console.log("using openai");
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
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
      return new ChatGooglePaLM({
        temperature: temperature,
        apiKey: process.env.GOOGLE_API_KEY,
        ...otherFields,
      });
    case "huggingface-api":
      console.log("using huggingface-api");
      return new HuggingFaceInference({
        modelName: huggingfaceModels[modelName],
        temperature: temperature,
        ...otherFields,
      });
    case "fireworks":
      return new DialoqbaseFireworksModel({
        model: fireworksModels[modelName],
        temperature: temperature,
        is_chat: !notChatModels.includes(modelName),
        ...otherFields,
      });
    case "openai-instruct":
      console.log("using openai-instruct");
      return new OpenAI({
        modelName: modelName,
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

export const huggingfaceModels: {
  [key: string]: string;
} = {
  "falcon-7b-instruct-inference": "tiiuae/falcon-7b-instruct",
};

export const fireworksModels: {
  [key: string]: string;
} = {
  "llama-v2-7b-chat": "accounts/fireworks/models/llama-v2-7b-chat",
  "llama-v2-13b-chat": "accounts/fireworks/models/llama-v2-13b-chat",
  "llama-v2-70b-chat": "accounts/fireworks/models/llama-v2-70b-chat",
  "llama-v2-7b-chat-w8a16": "accounts/fireworks/models/llama-v2-7b-chat-w8a16",
  "llama-v2-13b-chat-w8a16":
    "accounts/fireworks/models/llama-v2-13b-chat-w8a16",
  "llama-v2-13b-code-instruct":
    "accounts/fireworks/models/llama-v2-13b-code-instruct",
  "llama-v2-34b-code-instruct-w8a16":
    "accounts/fireworks/models/llama-v2-34b-code-instruct-w8a16",
  "mistral-7b-instruct-4k": "accounts/fireworks/models/mistral-7b-instruct-4k",
};

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

export const notChatModels = [
  "llama-v2-13b-code-instruct",
  "llama-v2-34b-code-instruct-w8a16",
  "mistral-7b-instruct-4k",
];

export const supportedModels = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-4-0613",
  "gpt-4",
  "claude-1",
  "claude-2",
  "claude-instant-1",
  "google-bison",
  "falcon-7b-instruct-inference",
  "llama-v2-7b-chat",
  "llama-v2-13b-chat",
  "llama-v2-70b-chat",
  "llama-v2-7b-chat-w8a16",
  "llama-v2-13b-chat-w8a16",
  "llama-v2-13b-code-instruct",
  "llama-v2-34b-code-instruct-w8a16",
  "gpt-3.5-turbo-instruct",
  "mistral-7b-instruct-4k"
];
