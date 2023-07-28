import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatGooglePaLM } from "langchain/chat_models/googlepalm";
import { HuggingFaceInference } from "langchain/llms/hf";

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

export const supportedModels = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-4-0613",
  "gpt-4",
  "claude-1",
  "claude-2",
  "claude-instant-1",
  "google-bison",
  "falcon-7b-instruct-inference"
];
