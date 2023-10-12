import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestBody, UpdateBotAudioSettings } from "./types";
import { DialoqbaseVectorStore } from "../../../../../../utils/store";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { embeddings } from "../../../../../../utils/embeddings";
import { chatModelProvider } from "../../../../../../utils/models";
import { DialoqbaseHybridRetrival } from "../../../../../../utils/hybrid";
import { BaseRetriever } from "langchain/schema/retriever";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import { Document } from "langchain/document";

type ChatMessage = {
  type: "human" | "ai" | "other";
  text: string;
};

type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: ChatMessage[];
};

const formatChatHistory = (history: ChatMessage[]): string => {
  return history
    .map((chatMessage: ChatMessage) => {
      if (chatMessage.type === "human") {
        return `Human: ${chatMessage.text}`;
      } else if (chatMessage.type === "ai") {
        return `Assistant: ${chatMessage.text}`;
      } else {
        return `${chatMessage.text}`;
      }
    })
    .join("\n");
};

const combineDocumentsFn = (docs: Document[], separator = "\n\n") => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join(separator);
};

export const chatRequestHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply,
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
        },
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

    const model = chatModelProvider(bot.provider, bot.model, temperature);

    if (!bot.use_rag) {
      const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        retriever,
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
    } else {
      const standaloneQuestionChain = RunnableSequence.from([
        {
          question: (input: ConversationalRetrievalQAChainInput) =>
            input.question,
          chat_history: (input: ConversationalRetrievalQAChainInput) =>
            formatChatHistory(input.chat_history),
        },
        PromptTemplate.fromTemplate(bot.questionGeneratorPrompt),
        model,
        new StringOutputParser(),
      ]);

      //@ts-ignore
      const answerChain = RunnableSequence.from([
        {
          context: retriever.pipe(combineDocumentsFn),
          question: new RunnablePassthrough(),
        },
        PromptTemplate.fromTemplate(bot.qaPrompt),
        model,
      ]);

      const chain = standaloneQuestionChain.pipe(
        answerChain,
      );
      const botResponse = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: history as ChatMessage[],
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
          message: botResponse.content,
          botPlaygroundId: hh,
          isBot: true,
          sources: documents.map((doc) => {
            return {
              ...doc,
            };
          }),
        },
      });

      const response = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: history as ChatMessage[],
      });

      return {
        bot: {
          text: response.content,
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
            text: response.content,
          },
        ],
      };
    }
  } catch (e) {
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
  reply: FastifyReply,
) => {
  const bot_id = request.params.id;

  const { message, history, history_id } = request.body;
  // const history = JSON.parse(chatHistory) as {
  //   type: string;
  //   text: string;
  // }[];
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
        },
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

    let response: any = null;
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

    reply.raw.on("close", () => {
      console.log("closed");
    });

    if (!bot.use_rag) {
      const chain = ConversationalRetrievalQAChain.fromLLM(
        streamedModel,
        retriever,
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
    } else {
      const standaloneQuestionChain = RunnableSequence.from([
        {
          question: (input: ConversationalRetrievalQAChainInput) =>
            input.question,
          chat_history: (input: ConversationalRetrievalQAChainInput) =>
            formatChatHistory(input.chat_history),
        },
        PromptTemplate.fromTemplate(bot.questionGeneratorPrompt),
        nonStreamingModel,
        new StringOutputParser(),
      ]);

      //@ts-ignore
      const answerChain = RunnableSequence.from([
        {
          context: retriever.pipe(combineDocumentsFn),
          question: new RunnablePassthrough(),
        },
        PromptTemplate.fromTemplate(bot.qaPrompt),
        streamedModel,
      ]);

      const chain = standaloneQuestionChain.pipe(
        answerChain,
      );
      response = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: history as ChatMessage[],
      });

      let historyId = history_id;
      const documents = await documentPromise;
      console.log(response);

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
          message: response.content,
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
            text: response.content,
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
              text: response.text,
            },
          ],
          history_id: historyId,
        }),
      });
      await nextTick();
      return reply.raw.end();
    }
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

export const updateBotAudioSettingsHandler = async (
  request: FastifyRequest<UpdateBotAudioSettings>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const { type, enabled } = request.body;

  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: {
      id,
      user_id: request.user.user_id,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  if (type === "elevenlabs") {
    await prisma.bot.update({
      where: {
        id,
      },
      data: {
        text_to_voice_enabled: enabled,
        text_to_voice_type: "elevenlabs",
      },
    });
  } else if (type === "web_api") {
    await prisma.bot.update({
      where: {
        id,
      },
      data: {
        text_to_voice_enabled: enabled,
        text_to_voice_type: "web_api",
      },
    });
  }

  return {
    success: true,
  };
};
