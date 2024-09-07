import { FastifyReply, FastifyRequest } from "fastify";
import { Document } from "langchain/document";
import { BaseRetriever } from "@langchain/core/retrievers";
import { ChatAPIRequest } from "./types";
import { embeddings } from "../../../../../utils/embeddings";
import { DialoqbaseHybridRetrival } from "../../../../../utils/hybrid";
import { DialoqbaseVectorStore } from "../../../../../utils/store";
import { chatModelProvider } from "../../../../../utils/models";
import { createChain, groupMessagesByConversation } from "../../../../../chain";
import { getModelInfo } from "../../../../../utils/get-model-info";
import { nextTick } from "../../../../../utils/nextTick";

async function getBotAndEmbedding(request: FastifyRequest<ChatAPIRequest>) {
  const bot_id = request.params.id;
  const user_id = request.user.user_id;
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findFirst({
    where: { id: bot_id, user_id },
  });

  if (!bot) {
    throw new Error("Bot not found");
  }

  const embeddingInfo = await getModelInfo({
    model: bot.embedding,
    prisma,
    type: "embedding",
  });

  if (!embeddingInfo) {
    throw new Error("Embedding not found");
  }

  const embeddingModel = embeddings(
    embeddingInfo.model_provider!.toLowerCase(),
    embeddingInfo.model_id,
    embeddingInfo?.config
  );

  return { bot, embeddingModel };
}

async function getRetriever(bot, embeddingModel, knowledge_base_ids) {
  let resolveWithDocuments: (value: Document[]) => void;
  const documentPromise = new Promise<Document[]>((resolve) => {
    resolveWithDocuments = resolve;
  });

  const callbacks = [
    {
      handleRetrieverEnd(documents) {
        resolveWithDocuments(documents);
      },
    },
  ];

  let retriever: BaseRetriever;
  if (bot.use_hybrid_search) {
    retriever = new DialoqbaseHybridRetrival(embeddingModel, {
      botId: bot.id,
      sourceId: null,
      callbacks,
      knowledge_base_ids,
    });
  } else {
    const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
      embeddingModel,
      {
        botId: bot.id,
        sourceId: null,
        knowledge_base_ids,
      }
    );
    retriever = vectorstore.asRetriever({ callbacks });
  }

  return { retriever, documentPromise };
}

async function getModel(bot, prisma) {
  const modelinfo = await getModelInfo({
    model: bot.model,
    prisma,
    type: "chat",
  });

  if (!modelinfo) {
    throw new Error("Model not found");
  }

  const botConfig: any = (modelinfo.config as {}) || {};
  if (
    bot.provider.toLowerCase() === "openai" &&
    bot.bot_model_api_key?.trim()
  ) {
    botConfig.configuration = { apiKey: bot.bot_model_api_key };
  }

  return chatModelProvider(bot.provider, bot.model, bot.temperature, botConfig);
}

async function handleChatRequest(
  request: FastifyRequest<ChatAPIRequest>,
  reply: FastifyReply,
  isStreaming: boolean
) {
  try {
    const { message, history } = request.body;
    const { bot, embeddingModel } = await getBotAndEmbedding(request);
    let knowledge_base_ids: string[] = [];

    if (
      request.body.knowledge_base_ids &&
      request.body.knowledge_base_ids.length > 0
    ) {
      knowledge_base_ids = request.body.knowledge_base_ids;
    }
    const { retriever, documentPromise } = await getRetriever(
      bot,
      embeddingModel,
      knowledge_base_ids
    );
    const model = await getModel(bot, request.server.prisma);

    const sanitizedQuestion = message.trim().replaceAll("\n", " ");
    const chatHistory = groupMessagesByConversation(
      history.slice(-bot.noOfChatHistoryInContext).map((message) => ({
        type: message.role,
        content: message.text,
      }))
    );

    const chain = createChain({
      llm: isStreaming ? model.withStreaming() : model,
      question_llm: model,
      question_template: bot.questionGeneratorPrompt,
      response_template: bot.qaPrompt,
      retriever,
    });

    let response = "";
    if (isStreaming) {
      const stream = await chain.stream({
        question: sanitizedQuestion,
        chat_history: chatHistory,
      });
      for await (const token of stream) {
        reply.sse({
          id: "",
          event: "chunk",
          data: JSON.stringify({
            bot: { text: token || "", sourceDocuments: [] },
            history: [
              ...history,
              { type: "human", text: message },
              { type: "ai", text: token || "" },
            ],
          }),
        });
        response += token;
      }
    } else {
      response = await chain.invoke({
        question: sanitizedQuestion,
        chat_history: chatHistory,
      });
    }

    const documents = await documentPromise;

    await request.server.prisma.botApiHistory.create({
      data: {
        api_key: request.headers.authorization || "",
        bot_id: bot.id,
        human: message,
        bot: response,
      },
    });

    const result = {
      bot: { text: response, sourceDocuments: documents },
      history: [
        ...history,
        { type: "human", text: message },
        { type: "ai", text: response },
      ],
    };

    if (isStreaming) {
      reply.sse({ event: "result", id: "", data: JSON.stringify(result) });
      await nextTick();
      return reply.raw.end();
    } else {
      return result;
    }
  } catch (e) {
    console.error(e);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
}

export const chatRequestAPIHandler = async (
  request: FastifyRequest<ChatAPIRequest>,
  reply: FastifyReply
) => {
  const { stream } = request.body;
  return handleChatRequest(request, reply, stream);
};
