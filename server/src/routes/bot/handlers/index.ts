import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestBody } from "./types";
import { DialoqbaseVectorStore } from "../../../utils/store";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { embeddings } from "../../../utils/embeddings";
import { chatModelProvider } from "../../../utils/models";

// prompt copied from https://github.com/mayooear/gpt4-pdf-chatbot-langchain
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

export const chatRequestHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply,
) => {
  const public_id = request.params.id;

  const { message, history } = request.body;

  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      publicId: public_id,
    },
  });

  if (!bot) {
    return {
      bot: {
        text: "You are in the wrong place, buddy.",
        sourceDocuments: [],
      },
      history: [
        ...history,
        {
          type: "human",
          text: message,
        },
        {
          type: "ai",
          text: "You are in the wrong place, buddy.",
        },
      ],
    };
  }

  const temperature = bot.temperature;

  const sanitizedQuestion = message.trim().replaceAll("\n", " ");
  const embeddingModel = embeddings(bot.embedding);

  const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
    embeddingModel,
    {
      botId: bot.id,
      sourceId: null,
    },
  );

  const model = chatModelProvider(
    bot.provider,
    bot.model,
    temperature,
  );

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
    chat_history: history
      .map((chatMessage) => {
        if (chatMessage.type === "human") {
          return `Human: ${chatMessage.text}`;
        } else if (chatMessage.type === "ai") {
          return `Assistant: ${chatMessage.text}`;
        } else {
          return `${chatMessage.text}`;
        }
      })
      .join("\n"),
  });

  return {
    bot: response,
    history: [...history, {
      type: "human",
      text: message,
    }, {
      type: "ai",
      text: response.text,
    }],
  };
};
