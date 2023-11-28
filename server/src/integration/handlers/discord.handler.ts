import { PrismaClient } from "@prisma/client";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseVectorStore } from "../../utils/store";
import { chatModelProvider } from "../../utils/models";
import { DialoqbaseHybridRetrival } from "../../utils/hybrid";
import { Document } from "langchain/document";
import { BaseRetriever } from "langchain/schema/retriever";
import { createChain } from "../../chain";
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

    // if (chat_history.length > 10) {
    //   chat_history.splice(0, chat_history.length - 10);
    // }

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
    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });
    if (bot.use_hybrid_search) {
      retriever = new DialoqbaseHybridRetrival(embeddingModel, {
        botId: bot.id,
        sourceId: null,
        callbacks: [
          {
            handleRetrieverEnd(documents) {
              resolveWithDocuments(documents);
            },
          },
        ],
      });
    } else {
      const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
        embeddingModel,
        {
          botId: bot.id,
          sourceId: null,
        }
      );

      retriever = vectorstore.asRetriever({
        callbacks: [
          {
            handleRetrieverEnd(documents) {
              resolveWithDocuments(documents);
            },
          },
        ],
      });
    }

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
      };
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

    await prisma.botDiscordHistory.create({
      data: {
        identifier: identifer,
        chat_id: user_id,
        human: message,
        bot: response,
      },
    });

    await prisma.$disconnect();

    let sourceDocuments = await documentPromise;

    return {
      text: response,
      sourceDocuments,
    };
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
