import "@tensorflow/tfjs-backend-cpu";
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {CohereEmbeddings} from  'langchain/embeddings/cohere'
export const embeddings = (embeddingsType: string) => {
  switch (embeddingsType) {
    case "tensorflow":
      return new TensorFlowEmbeddings();
    case "openai":
      return new OpenAIEmbeddings();
    case "cohere":
      return new CohereEmbeddings();
    default:
      return new OpenAIEmbeddings();
  }
};