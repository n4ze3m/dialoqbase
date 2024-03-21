import { FastifyReply, FastifyRequest } from "fastify";
import {
    HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT, QUESTION_GENERATOR_PROMPT,
} from "../../../../../utils/prompts";
import { AddNewSourceBulkById, CreateBotAPIRequest } from "./types";
import { getSettings } from "../../../../../utils/common";
import { apiKeyValidaton, apiKeyValidatonMessage } from "../../../../../utils/validate";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { validateDataSource } from "../../../../../utils/datasource-validation";

export const createBotAPIHandler = async (
    request: FastifyRequest<CreateBotAPIRequest>,
    reply: FastifyReply
) => {
    const {
        name: nameFromRequest,
        embedding,
        model,
        question_generator_prompt,
        system_prompt,
        temperature
    } = request.body;

    const prisma = request.server.prisma;

    // only non-admin users are affected by this settings
    const settings = await getSettings(prisma);
    const user = request.user;
    const isBotCreatingAllowed = settings?.allowUserToCreateBots;
    if (!user.is_admin && !isBotCreatingAllowed) {
        return reply.status(400).send({
            message: "Bot creation is disabled by admin",
        });
    }

    const totalBotsUserCreated = await prisma.bot.count({
        where: {
            user_id: request.user.user_id,
        },
    });

    const maxBotsAllowed = settings?.noOfBotsPerUser || 10;

    if (!user.is_admin && totalBotsUserCreated >= maxBotsAllowed) {
        return reply.status(400).send({
            message: `Reach maximum limit of ${maxBotsAllowed} bots per user`,
        });
    }
    const modelInfo = await prisma.dialoqbaseModels.findFirst({
        where: {
            hide: false,
            deleted: false,
            OR: [
                {
                    model_id: model
                },
                {
                    model_id: `${model}-dbase`
                }
            ]
        },
    });

    if (!modelInfo) {
        return reply.status(400).send({
            message: "Chat Model not found",
        });
    }

    const embeddingInfo = await prisma.dialoqbaseModels.findFirst({
        where: {
            OR: [
                {
                    model_id: embedding,
                },
                {
                    model_id: `dialoqbase_eb_${embedding}`
                }
            ],
            hide: false,
            deleted: false,
        },
    });

    if (!embeddingInfo) {
        return reply.status(400).send({
            message: "Embedding Model not found",
        });
    }

    const isEmbeddingsValid = apiKeyValidaton(
        `${embeddingInfo.model_provider}`.toLowerCase()
    );

    if (!isEmbeddingsValid) {
        return reply.status(400).send({
            message: apiKeyValidatonMessage(embedding),
        });
    }

    const isAPIKeyAddedForProvider = apiKeyValidaton(
        `${modelInfo.model_provider}`.toLowerCase()
    );

    if (!isAPIKeyAddedForProvider) {
        return reply.status(400).send({
            message: apiKeyValidatonMessage(modelInfo.model_provider || ""),
        });
    }

    const shortName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        length: 2,
    });

    const name = nameFromRequest || shortName;

    const isStreamingAvilable = modelInfo.stream_available;

    const bot = await prisma.bot.create({
        data: {
            name,
            embedding: embeddingInfo.model_id,
            model: modelInfo.model_id,
            provider: modelInfo.model_provider || "",
            streaming: isStreamingAvilable,
            user_id: request.user.user_id,
            temperature: temperature || 0.7,
            qaPrompt: system_prompt || HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT,
            questionGeneratorPrompt: question_generator_prompt || QUESTION_GENERATOR_PROMPT,
        },
    });

    return {
        id: bot.id,
    };
};


export const addNewSourceByIdBulkHandler = async (
    request: FastifyRequest<AddNewSourceBulkById>,
    reply: FastifyReply
) => {
    try {
        const prisma = request.server.prisma;
        const id = request.params.id;

        const bot = await prisma.bot.findFirst({
            where: {
                id,
                user_id: request.user.user_id,
            },
            include: {
                source: true,
            },
        });

        if (!bot) {
            return reply.status(404).send({
                message: "Bot not found",
            });
        }

        const data = request.body;

        const queueSource: any[] = [];

        const isOk = validateDataSource(data);

        if (isOk.length > 0) {
            return reply.status(400).send({
                message: isOk.join(", ")
            });
        }

        for (const source of data) {

            const { content, type } = source;

            const botSource = await prisma.botSource.create({
                data: {
                    content,
                    type,
                    botId: bot.id,
                    options: source.options,
                },
            });

            queueSource.push({
                ...botSource,
                embedding: bot.embedding,
                maxDepth: source.maxDepth,
                maxLinks: source.maxLinks,
                options: source.options,
            });
        }
        await request.server.queue.add(queueSource);

        return {
            success: true,
            source_ids: queueSource.map((source) => source.id),
        };
    } catch (error) {
        console.log(error);
        return reply.status(500).send({
            message: "Internal Server Error",
        });
    }
};