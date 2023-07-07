import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestBody } from "./types";
import { DialoqbaseVectorStore } from "../../../utils/store";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { embeddings } from "../../../utils/embeddings";
import { chatModelProvider } from "../../../utils/models";

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

  const model = chatModelProvider(bot.provider, bot.model, temperature);

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: bot.qaPrompt,
      questionGeneratorTemplate: bot.questionGeneratorPrompt,
      returnSourceDocuments: true,
    },
  );

  const chat_history = history
    .map((chatMessage: any) => {
      if (chatMessage.type === "human") {
        return `Human: ${chatMessage.text}`;
      } else if (chatMessage.type === "ai") {
        return `Assistant: ${chatMessage.text}`;
      } else {
        return `${chatMessage.text}`;
      }
    })
    .join("\n");

  console.log(chat_history);

  const response = await chain.call({
    question: sanitizedQuestion,
    chat_history: chat_history,
  });

  return {
    bot: response,
    history: [
      ...history,
      {
        type: "human",
        text: message,
      },
      {
        type: "ai",
        text: response.text,
      },
    ],
  };
};
