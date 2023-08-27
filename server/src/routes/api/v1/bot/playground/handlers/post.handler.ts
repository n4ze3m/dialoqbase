import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestBody } from "./types";
import { DialoqbaseVectorStore } from "../../../../../../utils/store";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { embeddings } from "../../../../../../utils/embeddings";
import { chatModelProvider } from "../../../../../../utils/models";

export const chatRequestHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply,
) => {
  const bot_id = request.params.id;

  const { message, history, history_id } = request.body;

  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      id: bot_id,
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

  let historyId = history_id;

  if (!historyId) {
    const newHistory = await prisma.botPlayground.create({
      data: {
        botId: bot.id,
        title: message,
      },
    });
    historyId = newHistory.id;
  }

  await prisma.botPlaygroundMessage.create({
    data: {
      type: "human",
      message: message,
      botPlaygroundId: historyId,
    },
  });

  await prisma.botPlaygroundMessage.create({
    data: {
      type: "ai",
      message: response.text,
      botPlaygroundId: historyId,
      isBot: true,
      sources: response?.sourceDocuments,
    },
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

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export const chatRequestStreamHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply,
) => {
  const bot_id = request.params.id;

  const { message, history, history_id } = request.body;
  // const history = JSON.parse(chatHistory) as {
  //   type: string;
  //   text: string;
  // }[];

  console.log("history", history);
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      id: bot_id,
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

  let response: any = null;

  reply.raw.on("close", () => {
    console.log("closed");
  });

  const streamedModel = chatModelProvider(
    bot.provider,
    bot.model,
    temperature,
    {
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            // if (token !== '[DONE]') {
            // console.log(token);
            return reply.sse({
              id: "",
              event: "chunk",
              data: JSON.stringify({
                message: token || "",
              }),
            });
            // } else {
            // console.log("done");
            // }
          },
        },
      ],
    },
  );

  const nonStreamingModel = chatModelProvider(
    bot.provider,
    bot.model,
    temperature,
  );

  const chain = ConversationalRetrievalQAChain.fromLLM(
    streamedModel,
    vectorstore.asRetriever(),
    {
      qaTemplate: bot.qaPrompt,
      questionGeneratorTemplate: bot.questionGeneratorPrompt,
      returnSourceDocuments: true,
      questionGeneratorChainOptions: {
        llm: nonStreamingModel,
      },
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

  console.log("Waiting for response...");

  response = await chain.call({
    question: sanitizedQuestion,
    chat_history: chat_history,
  });

  let historyId = history_id;

  if (!historyId) {
    const newHistory = await prisma.botPlayground.create({
      data: {
        botId: bot.id,
        title: message,
      },
    });
    historyId = newHistory.id;
  }

  await prisma.botPlaygroundMessage.create({
    data: {
      type: "human",
      message: message,
      botPlaygroundId: historyId,
    },
  });

  await prisma.botPlaygroundMessage.create({
    data: {
      type: "ai",
      message: response.text,
      botPlaygroundId: historyId,
      isBot: true,
      sources: response?.sourceDocuments,
    },
  });

  reply.sse({
    event: "result",
    id: "",
    data: JSON.stringify({
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
      history_id: historyId,
    }),
  });
  await nextTick();
  return reply.raw.end();
};
