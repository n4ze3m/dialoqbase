import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGooglePaLM } from "@langchain/community/chat_models/googlepalm";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { DialoqbaseFireworksModel } from "../models/fireworks";
import { OpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { Replicate } from "@langchain/community/llms/replicate";
import { ChatGroq } from "@langchain/groq"

export const chatModelProvider = (
  provider: string,
  modelName: string,
  temperature: number,
  otherFields?: any
) => {
  modelName = modelName.replace("-dbase", "");

  switch (provider.toLowerCase()) {
    case "openai":
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
        ...otherFields,
        configuration: {
          ...otherFields.configuration,
          baseURL: process.env.OPENAI_API_URL,
        },
      });
    case "anthropic":
      return new ChatAnthropic({
        modelName: modelName,
        temperature: temperature,
        ...otherFields,
      });
    case "google-bison":
      return new ChatGooglePaLM({
        temperature: temperature,
        apiKey: process.env.GOOGLE_API_KEY,
        ...otherFields,
      });
    case "huggingface-api":
      return new HuggingFaceInference({
        modelName: modelName,
        temperature: temperature,
        ...otherFields,
      });
    case "fireworks":
      return new DialoqbaseFireworksModel({
        model: modelName,
        temperature: temperature,
        is_chat: !notChatModels.includes(modelName),
        ...otherFields,
      });
    case "openai-instruct":
      return new OpenAI({
        modelName: modelName,
        temperature: temperature,
        ...otherFields,
        configuration: {
          baseURL: process.env.OPENAI_API_URL,
        },
      });
    case "local":
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
        openAIApiKey: otherFields.apiKey || process.env.OPENAI_API_KEY,
        ...otherFields,
        configuration: {
          baseURL: otherFields.baseURL,
          apiKey: otherFields.apiKey || process.env.OPENAI_API_KEY,
          defaultHeaders: {
            "HTTP-Referer":
              process.env.LOCAL_REFER_URL || "https://dialoqbase.n4ze3m.com/",
            "X-Title": process.env.LOCAL_TITLE || "Dialoqbase",
          },
        },
      });
    case "google":
      return new ChatGoogleGenerativeAI({
        modelName: modelName,
        maxOutputTokens: 2048,
        apiKey: process.env.GOOGLE_API_KEY,
        ...otherFields,
      });
    case "ollama":
      return new ChatOllama({
        baseUrl: otherFields.baseURL,
        model: modelName,
        ...otherFields,
      });
    case "replicate":
      return new Replicate({
        model: modelName,
        temperature: temperature,
        apiKey: otherFields.apiKey,
        ...otherFields,
      });
    case "groq":
      return new ChatGroq({
        model: modelName,
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
  "accounts/fireworks/models/llama-v2-13b-code-instruct",
  "accounts/fireworks/models/llama-v2-34b-code-instruct-w8a16",
  "accounts/fireworks/models/mistral-7b-instruct-4k",
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
  "mistral-7b-instruct-4k",
];
