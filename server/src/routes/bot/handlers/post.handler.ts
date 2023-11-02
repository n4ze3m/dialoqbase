import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestBody } from "./types";
import { DialoqbaseVectorStore } from "../../../utils/store";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { embeddings } from "../../../utils/embeddings";
import { chatModelProvider } from "../../../utils/models";
import { BaseRetriever } from "langchain/schema/retriever";
import { DialoqbaseHybridRetrival } from "../../../utils/hybrid";
import { Document } from "langchain/document";
import { PromptTemplate } from "langchain/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import {
  ChatMessage,
  ConversationalRetrievalQAChainInput,
  combineDocumentsFn,
  formatChatHistory,
} from "../../../utils/rag";

export const chatRequestHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply
) => {
  const { message, history, history_id } = request.body;
  try {
    const public_id = request.params.id;

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

    if (bot.bot_protect) {
      if (!request.session.get("is_bot_allowed")) {
        return {
          bot: {
            text: "You are not allowed to chat with this bot.",
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
              text: "You are not allowed to chat with this bot.",
            },
          ],
        };
      }
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

    if (!bot.use_rag) {
      const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
        qaTemplate: bot.qaPrompt,
        questionGeneratorTemplate: bot.questionGeneratorPrompt,
        returnSourceDocuments: true,
      });

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

      const response = await chain.call({
        question: sanitizedQuestion,
        chat_history: chat_history,
      });

      await prisma.botWebHistory.create({
        data: {
          chat_id: history_id,
          bot_id: bot.id,
          bot: response.text,
          human: message,
          metadata: {
            ip: request?.ip,
            user_agent: request?.headers["user-agent"],
          },
          sources: response?.sources,
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

      const chain = standaloneQuestionChain.pipe(answerChain);
      const botResponse = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: history as ChatMessage[],
      });

      const documents = await documentPromise;

      await prisma.botWebHistory.create({
        data: {
          chat_id: history_id,
          bot_id: bot.id,
          bot: botResponse.content,
          human: message,
          metadata: {
            ip: request?.ip,
            user_agent: request?.headers["user-agent"],
          },
          sources: documents.map((doc) => {
            return {
              ...doc,
            };
          }),
        },
      });

      return {
        bot: {
          text: botResponse.content,
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
            text: botResponse.content,
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

export function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export const chatRequestStreamHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply
) => {
  const { message, history, history_id } = request.body;

  try {
    const public_id = request.params.id;
    // get user meta info from request
    // const meta = request.headers["user-agent"];
    // ip address

    // const history = JSON.parse(chatHistory) as {
    //   type: string;
    //   text: string;
    // }[];

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

    if (bot.bot_protect) {
      if (!request.session.get("is_bot_allowed")) {
        console.log("not allowed");

        reply.raw.setHeader("Content-Type", "text/event-stream");

        reply.sse({
          event: "result",
          id: "",
          data: JSON.stringify({
            bot: {
              text: "You are not allowed to chat with this bot.",
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
                text: "You are not allowed to chat with this bot.",
              },
            ],
          }),
        });

        await nextTick();

        return reply.raw.end();
      }
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

    let response: any = null;

    reply.raw.on("close", () => {
      console.log("closed");
    });

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
        ...botConfig,
      }
    );

    const nonStreamingModel = chatModelProvider(
      bot.provider,
      bot.model,
      temperature,
      {
        streaming: false,
        ...botConfig,
      }
    );
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
        }
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

      await prisma.botWebHistory.create({
        data: {
          chat_id: history_id,
          bot_id: bot.id,
          bot: response.text,
          human: message,
          metadata: {
            ip: request?.ip,
            user_agent: request?.headers["user-agent"],
          },
          sources: response?.sources || response?.sourceDocuments || [],
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

      const chain = standaloneQuestionChain.pipe(answerChain);
      response = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: history as ChatMessage[],
      });

      const documents = await documentPromise;

      await prisma.botWebHistory.create({
        data: {
          chat_id: history_id,
          bot_id: bot.id,
          bot: response.text,
          human: message,
          metadata: {
            ip: request?.ip,
            user_agent: request?.headers["user-agent"],
          },
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
