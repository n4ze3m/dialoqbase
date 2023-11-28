import { PrismaClient } from "@prisma/client";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseVectorStore } from "../../utils/store";
import { chatModelProvider } from "../../utils/models";
import { BaseRetriever } from "langchain/schema/retriever";
import { DialoqbaseHybridRetrival } from "../../utils/hybrid";
import { createChain } from "../../chain";
const prisma = new PrismaClient();

export const whatsappBotHandler = async (
  bot_id: string,
  hash: string,
  from: string,
  message: string
) => {
  try {
    await prisma.$connect();

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
    });

    if (!bot) {
      return null;
    }

    const isAlreadyReplied = await prisma.botWhatsappHistory.findFirst({
      where: {
        chat_id: hash,
      },
    });

    if (isAlreadyReplied) {
      return null;
    }

    const chat_history = await prisma.botWhatsappHistory.findMany({
      where: {
        from: from,
        identifier: `${bot_id}-${from}`,
      },
    });

    if (chat_history.length > 20) {
      chat_history.splice(0, chat_history.length - 20);
    }

    let history = chat_history.map((message) => ({
      human: message.human,
      ai: message.bot,
    }));

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

    await prisma.botWhatsappHistory.create({
      data: {
        identifier: `${bot_id}-${from}`,
        chat_id: hash,
        from: from,
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

export const clearHistoryWhatsapp = async (bot_id: string, from: string) => {
  try {
    await prisma.$connect();

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
      },
    });

    if (!bot) {
      return null;
    }

    await prisma.botWhatsappHistory.deleteMany({
      where: {
        from: from,
        identifier: `${bot_id}-${from}`,
      },
    });

    await prisma.$disconnect();

    return "Chat history cleared";
  } catch (error) {
    console.log(error);
    return "Opps! Something went wrong";
  }
};
