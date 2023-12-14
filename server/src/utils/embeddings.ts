import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { TransformersEmbeddings } from "../embeddings/transformer-embedding";
import { GooglePaLMEmbeddings } from "langchain/embeddings/googlepalm";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = (embeddingsType: string) => {
  switch (embeddingsType) {
    case "openai":
      return new OpenAIEmbeddings();
    case "cohere":
      return new CohereEmbeddings();
    case "huggingface-api":
      return new HuggingFaceInferenceEmbeddings();
    case "transformer":
      return new TransformersEmbeddings({
        model: "Xenova/all-MiniLM-L6-v2",
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
      return new GooglePaLMEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY!,
        modelName: "models/embedding-gecko-001",
      });
    case "goolge":
      return new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY!,
      });
    case "jina-api":
      return new OpenAIEmbeddings({
        modelName: "jina-embeddings-v2-base-en",
        openAIApiKey: process.env.JINA_API_KEY,
        configuration: {
          baseURL: "https://api.jina.ai/v1",
        },
      });
    default:
      return new OpenAIEmbeddings();
  }
};

export const supportedEmbeddings = [
  "openai",
  "cohere",
  "huggingface-api",
  "transformer",
  "google-gecko",
  "supabase",
  "jina",
  "google"
];
