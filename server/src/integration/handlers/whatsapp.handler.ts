import { PrismaClient } from "@prisma/client";
import { embeddings } from "../../utils/embeddings";
import { DialoqbaseVectorStore } from "../../utils/store";
import { chatModelProvider } from "../../utils/models";
import { ConversationalRetrievalQAChain } from "langchain/chains";
const prisma = new PrismaClient();

export const whatsappBotHandler = async (
  bot_id: string,
  hash: string,
  from: string,
  message: string,
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

    if (chat_history.length > 10) {
      chat_history.splice(0, chat_history.length - 10);
    }

    let history = chat_history.map((chat) => {
      return `Human: ${chat.human}\nAssistant: ${chat.bot}`;
    }).join("\n");

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
        qaTemplate: bot.qaPrompt,
        questionGeneratorTemplate: bot.questionGeneratorPrompt,
        returnSourceDocuments: true,
      },
    );

    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history,
    });

    const bot_response = response["text"];

    await prisma.botWhatsappHistory.create({
      data: {
        identifier: `${bot_id}-${from}`,
        chat_id: hash,
        from: from,
        human: message,
        bot: bot_response,
      },
    });

    await prisma.$disconnect();

    return bot_response;
  } catch (error) {
    console.log(error);
    return "Opps! Something went wrong";
  }
};

export const clearHistoryWhatsapp = async (
    bot_id: string,
  from: string,
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
