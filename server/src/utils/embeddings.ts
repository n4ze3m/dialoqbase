import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { TransformersEmbeddings } from "../embeddings/transformer-embedding";
import { GooglePaLMEmbeddings } from "langchain/embeddings/googlepalm";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";

export const embeddings = (
  provider: string,
  modelName: string,
  otherFields: any
) => {
  modelName = modelName.replace("dialoqbase_eb_", "");
  switch (provider.toLocaleLowerCase()) {
    case "openai":
      return new OpenAIEmbeddings({
        modelName,
      });
    case "cohere":
      return new CohereEmbeddings({
        modelName,
      });
    case "huggingface-api":
      return new HuggingFaceInferenceEmbeddings();
    case "transformer":
      return new TransformersEmbeddings({
        model: modelName,
      });
    case "ollama":
      return new OllamaEmbeddings({
        baseUrl: otherFields?.baseURL || process.env.OLLAMA_EMBEDDING_API_URL,
        model:
          modelName !== "dialoqbase-ollama"
            ? modelName
            : process.env.OLLAMA_EMBEDDING_API_MODEL,
      });
    case "jina":
      return new TransformersEmbeddings({
        model: "Xenova/jina-embeddings-v2-small-en",
      });
    case "supabase":
      return new TransformersEmbeddings({
        model: "Supabase/gte-small",
      });
    case "google-gecko":
    case "google palm":
      console.log("Using Google Gecko Embeddings");
      return new GooglePaLMEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY!,
        modelName: modelName,
      });
    case "goolge":
    case "google":
      return new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY!,
        modelName,
      });
    case "jina-api":
    case "jina":
      return new OpenAIEmbeddings({
        modelName,
        openAIApiKey: process.env.JINA_API_KEY,
        configuration: {
          baseURL: "https://api.jina.ai/v1",
        },
      });
    case "local":
      return new OpenAIEmbeddings({
        modelName,
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
    default:
      console.log("Using Default Embeddings");
      return new OpenAIEmbeddings();
  }
};

export const supportedEmbeddings = [
  "openai",
  "cohere",
  "huggingface-api",
  "transformer",
  "ollama",
  "google-gecko",
  "supabase",
  "jina",
  "google",
];
