import { FastifyPluginAsync } from "fastify";
import { createBotHandler } from "./handlers";
import { DialoqbaseVectorStore } from "../../../../utils/store";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

const CONDENSE_PROMPT =
  `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT =
  `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`;
const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/", createBotHandler);

  fastify.get("/", async (req, res) => {
    const botId = "cliiqy93j0000gb5kltrec692";
    const question = "tell me about nazeem"

    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        botId,
        sourceId: null,
      },
    );

    const model = new OpenAI({
      modelName: "gpt-3.5-turbo",
    });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorstore.asRetriever(),
      {
        qaTemplate: QA_PROMPT,
        questionGeneratorTemplate: CONDENSE_PROMPT,
        returnSourceDocuments: true,
      },
    );

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: [],
    });

    return {
      response,
    }
  });
};

export default root;
