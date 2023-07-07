import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestBody, ChatStyleRequest } from "./types";
import { DialoqbaseVectorStore } from "../../../utils/store";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { embeddings } from "../../../utils/embeddings";
import { chatModelProvider } from "../../../utils/models";

export const getChatStyleByIdHandler = async (
  request: FastifyRequest<ChatStyleRequest>,
  reply: FastifyReply,
) => {
  const prisma = request.server.prisma;
  const bot_id = request.params.id;

  const isBotExist = await prisma.bot.findFirst({
    where: {
      publicId: bot_id,
    },
  });

  if (!isBotExist) {
    return reply.send({
      data: {
        background_color: "#ffffff",
        bot_name: "ACME Inc. Bot",
        streaming: false,
        show_reference: false,
        chat_bot_bubble_style: {
          background_color: "#C3CDDB",
          text_color: "#000000",
        },
        chat_human_bubble_style: {
          background_color: "#2590EB",
          text_color: "#ffffff",
        },
        first_message: "Hi, I'm here to help. What can I do for you today?",
      },
    });
  }

  const botAppearance = await prisma.botAppearance.findFirst({
    where: {
      bot_id: isBotExist.id,
    },
  });

  if (botAppearance) {
    return {
      data: {
        ...botAppearance,
        streaming: isBotExist.streaming,
        show_reference: isBotExist.showRef,
        bot_id: undefined,
      },
    };
  }

  return {
    data: {
      background_color: "#ffffff",
      bot_name: "ACME Inc. Bot",
      streaming: isBotExist.streaming,
      show_reference: isBotExist.showRef,
      chat_bot_bubble_style: {
        background_color: "#C3CDDB",
        text_color: "#000000",
      },
      chat_human_bubble_style: {
        background_color: "#2590EB",
        text_color: "#ffffff",
      },
      first_message: "Hi, I'm here to help. What can I do for you today?",
    },
  };
};

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export const chatRequestStreamHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply,
) => {
  const public_id = request.params.id;

  const { message, history } = request.body;
  // const history = JSON.parse(chatHistory) as {
  //   type: string;
  //   text: string;
  // }[];

  console.log("history", history);
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
              data: token || "",
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
    }),
  });
  await nextTick();
  return reply.raw.end();
};
