import type { FastifyRequest, FastifyReply } from "fastify";
import type { OpenaiRequestType } from "./type";
import { getModelInfo } from "../../../../utils/get-model-info";
import { embeddings } from "../../../../utils/embeddings";
import { Document } from "langchain/document";
import { BaseRetriever } from "@langchain/core/retrievers";
import { DialoqbaseHybridRetrival } from "../../../../utils/hybrid";
import { DialoqbaseVectorStore } from "../../../../utils/store";
import { createChatModel } from "../bot/playground/chat.service";
import { createChain } from "../../../../chain";
import {
    openaiNonStreamResponse,
    openaiStreamResponse,
} from "./openai-response";
import { groupOpenAiMessages } from "./other";
import { nextTick } from "../../../../utils/nextTick";

export const createChatCompletionHandler = async (
    request: FastifyRequest<OpenaiRequestType>,
    reply: FastifyReply
) => {
    try {
        const { model, messages } = request.body;

        const prisma = request.server.prisma;

        let knowledge_base_ids: string[] = [];

        const kb = request.body?.tools?.find(
            (e) => e.type === "knowledge_base" && e.value.length > 0
        );
        if (kb) {
            knowledge_base_ids = kb.value;
        }
        console.log(knowledge_base_ids)
        const bot = await prisma.bot.findFirst({
            where: {
                OR: [
                    {
                        id: model,
                    },
                    {
                        publicId: model,
                    },
                ],
                user_id: request.user.is_admin ? undefined : request.user.user_id,
            },
        });

        if (!bot) {
            return reply.status(404).send({
                error: {
                    message: "Bot not found",
                    type: "not_found",
                    param: "model",
                    code: "bot_not_found",
                },
            });
        }

        const embeddingInfo = await getModelInfo({
            prisma,
            model: bot.embedding,
            type: "embedding",
        });

        if (!embeddingInfo) {
            return reply.status(400).send({
                error: {
                    message: "Embedding not found",
                    type: "not_found",
                    param: "embedding",
                    code: "embedding_not_found",
                },
            });
        }

        const embeddingModel = embeddings(
            embeddingInfo.model_provider!.toLowerCase(),
            embeddingInfo.model_id,
            embeddingInfo?.config
        );

        const modelinfo = await getModelInfo({
            prisma,
            model: bot.model,
            type: "chat",
        });

        if (!modelinfo) {
            return reply.status(400).send({
                error: {
                    message: "Model not found",
                    type: "not_found",
                    param: "model",
                    code: "model_not_found",
                },
            });
        }

        const botConfig = (modelinfo.config as {}) || {};
        let retriever: BaseRetriever;
        let resolveWithDocuments: (value: Document[]) => void;

        if (bot.use_hybrid_search) {
            retriever = new DialoqbaseHybridRetrival(embeddingModel, {
                botId: bot.id,
                sourceId: null,
                knowledge_base_ids,
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
                    knowledge_base_ids,

                }
            );

            retriever = vectorstore.asRetriever({});
        }

        const streamedModel = createChatModel(
            bot,
            bot.temperature,
            botConfig,
            true
        );
        const nonStreamingModel = createChatModel(bot, bot.temperature, botConfig);

        const chain = createChain({
            llm: streamedModel,
            question_llm: nonStreamingModel,
            question_template: bot.questionGeneratorPrompt,
            response_template: bot.qaPrompt,
            retriever,
        });

        if (!request.body.stream) {
            const res = await chain.invoke({
                question: messages[messages.length - 1].content,
                chat_history: groupOpenAiMessages(messages),
            });

            return reply.status(200).send(openaiNonStreamResponse(res, bot.name));
        }

        const stream = await chain.stream({
            question: messages[messages.length - 1].content,
            chat_history: groupOpenAiMessages(messages),
        });
        reply.raw.setHeader("Content-Type", "text/event-stream");

        for await (const token of stream) {
            reply.sse({
                data: openaiStreamResponse(token || "", bot.name),
            });
        }
        reply.sse({
            data: "[DONE]\n\n",
        });
        await nextTick();
        return reply.raw.end();
    } catch (error) {
        console.log(error);
        return reply.status(500).send({
            error: {
                message: error.message,
                type: "internal_server_error",
                param: null,
                code: "internal_server_error",
            },
        });
    }
};
