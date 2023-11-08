import { FastifyReply, FastifyRequest } from "fastify";
import { ChatAPIRequest } from "./types";
import { DialoqbaseVectorStore } from "../../../utils/store";
import { embeddings } from "../../../utils/embeddings";
import { chatModelProvider } from "../../../utils/models";
import { nextTick } from "./post.handler";
import { Document } from "langchain/document";
import { BaseRetriever } from "langchain/schema/retriever";
import { DialoqbaseHybridRetrival } from "../../../utils/hybrid";
import { createChain, groupMessagesByConversation } from "../../../chain";

export const chatRequestAPIHandler = async (
  request: FastifyRequest<ChatAPIRequest>,
  reply: FastifyReply
) => {
  const { message, history, stream } = request.body;
  if (stream) {
    try {
      const public_id = request.params.id;
      const prisma = request.server.prisma;

      const bot = await prisma.bot.findFirst({
        where: {
          publicId: public_id,
        },
      });

      if (!bot) {
        return reply.status(404).send({
          message: "Bot not found",
        });
      }

      if (bot.bot_api_key !== request.headers["x-api-key"]) {
        return reply.status(403).send({
          message: "Forbidden",
        });
      }

      const temperature = bot.temperature;

      const sanitizedQuestion = message.trim().replaceAll("\n", " ");
      const embeddingModel = embeddings(bot.embedding);

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
        return reply.status(404).send({
          message: "Model not found",
        });
      }

      const botConfig = (modelinfo.config as {}) || {};
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
      const chain = createChain({
        llm: streamedModel,
        question_llm: nonStreamingModel,
        question_template: bot.questionGeneratorPrompt,
        response_template: bot.qaPrompt,
        retriever,
      });

      let response = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: groupMessagesByConversation(
          history.map((message) => ({
            type: message.role,
            content: message.text,
          }))
        ),
      });
      const documents = await documentPromise;

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
        }),
      });
      await nextTick();
      return reply.raw.end();
    } catch (e) {
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  } else {
    try {
      const public_id = request.params.id;

      const prisma = request.server.prisma;

      const bot = await prisma.bot.findFirst({
        where: {
          publicId: public_id,
        },
      });

      if (!bot) {
        return reply.status(404).send({
          message: "Bot not found",
        });
      }

      if (bot.bot_api_key !== request.headers["x-api-key"]) {
        return reply.status(403).send({
          message: "Forbidden",
        });
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
            type: message.role,
            content: message.text,
          }))
        ),
      });

      const documents = await documentPromise;

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
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
};
