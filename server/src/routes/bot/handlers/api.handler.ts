import { FastifyReply, FastifyRequest } from "fastify";
import { ChatAPIRequest } from "./types";
import { DialoqbaseVectorStore } from "../../../utils/store";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { embeddings } from "../../../utils/embeddings";
import { chatModelProvider } from "../../../utils/models";
import { nextTick } from "./post.handler";

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

      const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
        embeddingModel,
        {
          botId: bot.id,
          sourceId: null,
        }
      );

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
        return reply.status(404).send({
          message: "Model not found",
        });
      }

      const botConfig = (modelinfo.config as {}) || {};

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
        }
      );

      const chat_history = history
        .map((chatMessage: any) => {
          if (chatMessage.role === "human") {
            return `Human: ${chatMessage.text}`;
          } else if (chatMessage.role === "ai") {
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
        return reply.status(404).send({
          message: "Model not found",
        });
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

      const chat_history = history
        .map((chatMessage: any) => {
          if (chatMessage.role === "human") {
            return `Human: ${chatMessage.text}`;
          } else if (chatMessage.role === "ai") {
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
    } catch (e) {
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
};
