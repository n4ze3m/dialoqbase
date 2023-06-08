import "@tensorflow/tfjs-backend-cpu";
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const embeddings = (embeddingsType: string) => {
  switch (embeddingsType) {
    case "tensorflow":
      return new TensorFlowEmbeddings();
    case "openai":
      return new OpenAIEmbeddings();
    default:
      return new OpenAIEmbeddings();
  }
};
