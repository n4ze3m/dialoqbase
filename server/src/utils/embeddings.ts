import "@tensorflow/tfjs-backend-cpu";
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { TransformersEmbeddings } from "../embeddings/transformer-embedding";
import { GoogleGeckoEmbeddings } from "../embeddings/google-gecko-embedding";

export const embeddings = (embeddingsType: string) => {
  switch (embeddingsType) {
    case "tensorflow":
      return new TensorFlowEmbeddings();
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
      return new GoogleGeckoEmbeddings();
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
  "tensorflow",
  "openai",
  "cohere",
  "huggingface-api",
  "transformer",
  "google-gecko",
  "supabase",
  "jina",
];
