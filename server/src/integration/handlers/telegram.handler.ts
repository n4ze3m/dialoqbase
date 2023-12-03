import { PrismaClient } from "@prisma/client";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseVectorStore } from "../../utils/store";
import { chatModelProvider } from "../../utils/models";
import { DialoqbaseHybridRetrival } from "../../utils/hybrid";
import { BaseRetriever } from "langchain/schema/retriever";
import { createChain } from "../../chain";
const prisma = new PrismaClient();

export const telegramBotHandler = async (
  identifer: string,
  message: string,
  user_id: number
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

    const chat_history = await prisma.botTelegramHistory.findMany({
      where: {
        new_chat_id: `${user_id}`,
        identifier: identifer,
      },
    });

    let history = chat_history.map((message) => ({
      human: message.human,
      ai: message.bot,
    }));

    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    const temperature = bot.temperature;

    const sanitizedQuestion = message.trim().replaceAll("\n", " ");
    const embeddingModel = embeddings(bot.embedding);

    let retriever: BaseRetriever;

    if (bot.use_hybrid_search) {
      retriever = new DialoqbaseHybridRetrival(embeddingModel, {
        botId: bot.id,
        sourceId: null,
      });
    } else {
      const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
        embeddingModel,
        {
          botId: bot.id,
          sourceId: null,
        }
      );

      retriever = vectorstore.asRetriever({});
    }

    const modelinfo = await prisma.dialoqbaseModels.findFirst({
      where: {
        model_id: bot.model,
        hide: false,
        deleted: false,
      },
    });

    if (!modelinfo) {
      return "Unable to find model";
    }

    const botConfig: any = (modelinfo.config as {}) || {};
    if (bot.provider.toLowerCase() === "openai") {
      if (bot.bot_model_api_key && bot.bot_model_api_key.trim() !== "") {
        botConfig.configuration = {
          apiKey: bot.bot_model_api_key,
        };
      }
    }

    const model = chatModelProvider(bot.provider, bot.model, temperature, {
      ...botConfig,
    });

    const chain = createChain({
      llm: model,
      question_llm: model,
      question_template: bot.questionGeneratorPrompt,
      response_template: bot.qaPrompt,
      retriever,
    });

    const response = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: history,
    });

    await prisma.botTelegramHistory.create({
      data: {
        identifier: identifer,
        new_chat_id: `${user_id}`,
        human: message,
        bot: response,
      },
    });

    await prisma.$disconnect();

    return response;
  } catch (error) {
    console.log(error);
    return "Opps! Something went wrong";
  }
};

export const deleteTelegramChatHistory = async (
  identifier: string,
  chat_id: number
) => {
  try {
    const bot_id = identifier.split("-")[2];

    await prisma.$connect();

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
    });

    if (!bot) {
      return "Opps! Bot not found";
    }

    await prisma.botTelegramHistory.deleteMany({
      where: {
        identifier: identifier,
        new_chat_id: `${chat_id}`,
      },
    });

    await prisma.$disconnect();

    return "Chat history deleted successfully";
  } catch (error) {
    console.log(error);
    return "Opps! Something went wrong";
  }
};

export const welcomeMessage = async (identifier: string) => {
  try {
    const bot_id = identifier.split("-")[2];

    await prisma.$connect();

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
      include: {
        BotAppearance: true,
      },
    });

    if (!bot) {
      return "Hey, How can I assist you?";
    }

    let message = "Hey, How can I assist you?";

    if (bot.BotAppearance.length > 0) {
      message = bot.BotAppearance[0].first_message;
    }

    await prisma.$disconnect();

    return message;
  } catch (error) {
    console.log(error);
    return "Opps! Something went wrong";
  }
};
