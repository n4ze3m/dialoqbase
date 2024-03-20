import { FastifyReply, FastifyRequest } from "fastify";
import { Document } from "langchain/document";
import { BaseRetriever } from "@langchain/core/retrievers";
import { ChatAPIRequest } from "./types";
import { embeddings } from "../../../../../utils/embeddings";
import { DialoqbaseHybridRetrival } from "../../../../../utils/hybrid";
import { DialoqbaseVectorStore } from "../../../../../utils/store";
import { chatModelProvider } from "../../../../../utils/models";
import { createChain, groupMessagesByConversation } from "../../../../../chain";
function nextTick() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}
export const chatRequestAPIHandler = async (
    request: FastifyRequest<ChatAPIRequest>,
    reply: FastifyReply
) => {
    const { message, history, stream } = request.body;
    if (stream) {
        try {
            const bot_id = request.params.id;
            const prisma = request.server.prisma;
            const user_id = request.user.user_id;

            const bot = await prisma.bot.findFirst({
                where: {
                    id: bot_id,
                    user_id
                },
            });

            if (!bot) {
                return reply.status(404).send({
                    message: "Bot not found",
                });
            }


            const temperature = bot.temperature;

            const sanitizedQuestion = message.trim().replaceAll("\n", " ");
            const embeddingInfo = await prisma.dialoqbaseModels.findFirst({
                where: {
                    model_id: bot.embedding,
                    hide: false,
                    deleted: false,
                },
            });

            if (!embeddingInfo) {
                return reply.status(404).send({
                    message: "Embedding not found",
                });
            }

            const embeddingModel = embeddings(
                embeddingInfo.model_provider!.toLowerCase(),
                embeddingInfo.model_id,
                embeddingInfo?.config
            );

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
                        type: message.role,
                        content: message.text,
                    }))
                ),
            });

            for await (const token of stream) {
                reply.sse({
                    id: "",
                    event: "chunk",
                    data: JSON.stringify({
                        bot: {
                            text: token || "",
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
                                text: token || "",
                            },
                        ],
                    }),
                });
                response += token;
            }

            const documents = await documentPromise;


            await prisma.botApiHistory.create({
                data: {
                    api_key: request.headers.authorization || "",
                    bot_id: bot.id,
                    human: message,
                    bot: response,
                }
            })

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
            const bot_id = request.params.id;
            const user_id = request.user.user_id;

            const prisma = request.server.prisma;

            const bot = await prisma.bot.findFirst({
                where: {
                    id: bot_id,
                    user_id
                },
            });

            if (!bot) {
                return reply.status(404).send({
                    message: "Bot not found",
                });
            }

            const temperature = bot.temperature;

            const sanitizedQuestion = message.trim().replaceAll("\n", " ");
            const embeddingInfo = await prisma.dialoqbaseModels.findFirst({
                where: {
                    model_id: bot.embedding,
                    hide: false,
                    deleted: false,
                },
            });

            if (!embeddingInfo) {
                return reply.status(404).send({
                    message: "Embedding not found",
                });
            }

            const embeddingModel = embeddings(
                embeddingInfo.model_provider!.toLowerCase(),
                embeddingInfo.model_id,
                embeddingInfo?.config
            );

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
                return reply.status(404).send({
                    message: "Model not found",
                });
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

            await prisma.botApiHistory.create({
                data: {
                    api_key: request.headers.authorization || "",
                    bot_id: bot.id,
                    human: message,
                    bot: botResponse,
                }
            })

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
