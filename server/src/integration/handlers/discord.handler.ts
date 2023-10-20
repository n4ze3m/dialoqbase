import { PrismaClient } from "@prisma/client";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseVectorStore } from "../../utils/store";
import { chatModelProvider } from "../../utils/models";
import { ConversationalRetrievalQAChain } from "langchain/chains";
const prisma = new PrismaClient();

export const discordBotHandler = async (
  identifer: string,
  message: string,
  user_id: string
) => {
  try {
    const bot_id = identifer.split("-")[2];

    await prisma.$connect();

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
    });

    if (!bot) {
      return { text: "Opps! Bot not found" };
    }

    const chat_history = await prisma.botDiscordHistory.findMany({
      where: {
        chat_id: user_id,
        identifier: identifer,
      },
    });

    if (chat_history.length > 10) {
      chat_history.splice(0, chat_history.length - 10);
    }

let history = chat_history
      .map((chat) => {
        return `Human: ${chat.human}\nAssistant: ${chat.bot}`;
      })
      .join("\n");

    const temperature = bot.temperature;

    const sanitizedQuestion = message.trim().replaceAll("\n", " ");
    const embeddingModel = embeddings(bot.embedding);

    const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
      embeddingModel,
      {
        botId: bot.id,
        sourceId: null,
      }
    );

    const modelinfo = await prisma.dialoqbaseModels.findFirst({
      where: {
        model_id: bot.model,
        hide: false,
        deleted: false,
      },
    });

    if (!modelinfo) {
      return {
        text: "Opps! Model not found",
      }
    }

    const botConfig = (modelinfo.config as {}) || {};

    const model = chatModelProvider(bot.provider, bot.model, temperature, {
      ...botConfig,
    });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorstore.asRetriever(),
      {
        qaTemplate: bot.qaPrompt,
        questionGeneratorTemplate: bot.questionGeneratorPrompt,
        returnSourceDocuments: true,
      }
    );

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history,
    });

    await prisma.botDiscordHistory.create({
      data: {
        identifier: identifer,
        chat_id: user_id,
        human: message,
        bot: response.text,
      },
    });

    await prisma.$disconnect();

    return response;
  } catch (error) {
    console.log(error);
    return { text: "Opps! Something went wrong" };
  }
};

export const clearDiscordChatHistory = async (
  identifer: string,
  user_id: string
) => {
  try {
    const bot_id = identifer.split("-")[2];

    await prisma.$connect();

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
    });

    if (!bot) {
      return "Opps! Bot not found";
    }

    await prisma.botDiscordHistory.deleteMany({
      where: {
        chat_id: user_id,
        identifier: identifer,
      },
    });

    await prisma.$disconnect();

    return "Chat history cleared";
  } catch (error) {
    console.log(error);
    return "Opps! Something went wrong";
  }
};
