import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestBody } from "./types";
import { DialoqbaseVectorStore } from "../../../../../../utils/store";
import { embeddings } from "../../../../../../utils/embeddings";
import { chatModelProvider } from "../../../../../../utils/models";
import { DialoqbaseHybridRetrival } from "../../../../../../utils/hybrid";
import { BaseRetriever } from "langchain/schema/retriever";
import { Document } from "langchain/document";
import {
  createChain,
  groupMessagesByConversation,
} from "../../../../../../chain";

export const chatRequestHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply
) => {
  const bot_id = request.params.id;

  const { message, history, history_id } = request.body;
  try {
    const prisma = request.server.prisma;

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
        user_id: request.user.user_id,
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
        bot: {
          text: "Unable to find model",
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
            text: "Unable to find model",
          },
        ],
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


    const botResponse = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: groupMessagesByConversation(
        history.map((message) => ({
          type: message.type,
          content: message.text,
        }))
      ),
    });

    const documents = await documentPromise;
    let hh = history_id;

    if (!hh) {
      const newHistory = await prisma.botPlayground.create({
        data: {
          botId: bot.id,
          title: message,
        },
      });
      hh = newHistory.id;
    }

    await prisma.botPlaygroundMessage.create({
      data: {
        type: "human",
        message: message,
        botPlaygroundId: hh,
      },
    });

    await prisma.botPlaygroundMessage.create({
      data: {
        type: "ai",
        message: botResponse,
        botPlaygroundId: hh,
        isBot: true,
        sources: documents.map((doc) => {
          return {
            ...doc,
          };
        }),
      },
    });

    return {
      bot: {
        text: botResponse,
        sourceDocuments: documents,
      },
      history: [
        ...history,
        {
          type: "human",
          text: message,
        },
        {
          type: "ai",
          text: botResponse,
        },
      ],
    };
  } catch (e) {
    console.log(e);
    return {
      bot: {
        text: "There was an error processing your request.",
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
          text: "There was an error processing your request.",
        },
      ],
    };
  }
};

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export const chatRequestStreamHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply
) => {
  const bot_id = request.params.id;

  const { message, history, history_id } = request.body;
  try {
    const prisma = request.server.prisma;

    const bot = await prisma.bot.findFirst({
      where: {
        id: bot_id,
        user_id: request.user.user_id,
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
      reply.raw.setHeader("Content-Type", "text/event-stream");

      reply.sse({
        event: "result",
        id: "",
        data: JSON.stringify({
          bot: {
            text: "There was an error processing your request.",
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
              text: "There was an error processing your request.",
            },
          ],
        }),
      });
      await nextTick();

      return reply.raw.end();
    }

    const botConfig: any = (modelinfo.config as {}) || {};
    if (bot.provider.toLowerCase() === "openai") {
      if (bot.bot_model_api_key && bot.bot_model_api_key.trim() !== "") {
        botConfig.configuration = {
          apiKey: bot.bot_model_api_key,
        };
      }
    }

    let response: string = "";
    const streamedModel = chatModelProvider(
      bot.provider,
      bot.model,
      temperature,
      {
        streaming: true,
        ...botConfig,
      }
    );

    const nonStreamingModel = chatModelProvider(
      bot.provider,
      bot.model,
      temperature,
      {
        ...botConfig,
      }
    );

    reply.raw.on("close", () => {
      // close the model
    });

    const chain = createChain({
      llm: streamedModel,
      question_llm: nonStreamingModel,
      question_template: bot.questionGeneratorPrompt,
      response_template: bot.qaPrompt,
      retriever,
    });

    let stream = await chain.stream({
      question: sanitizedQuestion,
      chat_history: groupMessagesByConversation(
        history.map((message) => ({
          type: message.type,
          content: message.text,
        }))
      ),
    });

    for await (const token of stream) {
      reply.sse({
        id: "",
        event: "chunk",
        data: JSON.stringify({
          message: token || "",
        }),
      });
      response += token;
    }

    let historyId = history_id;
    const documents = await documentPromise;

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
        message: response,
        botPlaygroundId: historyId,
        isBot: true,
        sources: documents.map((doc) => {
          return {
            ...doc,
          };
        }),
      },
    });

    reply.sse({
      event: "result",
      id: "",
      data: JSON.stringify({
        bot: {
          text: response,
          sourceDocuments: documents,
        },
        history: [
          ...history,
          {
            type: "human",
            text: message,
          },
          {
            type: "ai",
            text: response,
          },
        ],
        history_id: historyId,
      }),
    });
    await nextTick();
    return reply.raw.end();
  } catch (e) {
    console.log(e);
    reply.raw.setHeader("Content-Type", "text/event-stream");

    reply.sse({
      event: "result",
      id: "",
      data: JSON.stringify({
        bot: {
          text: "There was an error processing your request.",
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
            text: "There was an error processing your request.",
          },
        ],
      }),
    });
    await nextTick();

    return reply.raw.end();
  }
};
