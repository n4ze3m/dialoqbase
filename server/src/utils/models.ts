import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { GoogleChatBison } from "../models/bison";

export const chatModelProvider = (
  provider: string,
  modelName: string,
  temperature: number,
) => {
  switch (provider) {
    case "openai":
      console.log("using openai");
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
      });
    case "anthropic":
      console.log("using anthropic");
      return new ChatAnthropic({
        modelName: modelName,
        temperature: temperature,
      });
    case "google-bison":
      console.log("using google-bison");
      return new GoogleChatBison({
        temperature: temperature,
      });
    default:
      console.log("using default");
      return new ChatOpenAI({
        modelName: modelName,
        temperature: temperature,
      });
  }
};
