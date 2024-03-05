import { FastifyRequest, FastifyReply } from "fastify";
import { GetBotById } from "./types";
import { generateAPIKey } from "../../../../../utils/api";


export const createCopyHandler = async (
    request: FastifyRequest<GetBotById>,
    reply: FastifyReply
) => {
    const prisma = request.server.prisma;
    const bot_id = request.params.bot_id;

    const bot = await prisma.bot.findFirst({
        where: {
            id: bot_id,
            user_id: request.user.user_id,
        },
        include: {
            BotAppearance: true,
            source: true,
        }
    });

    if (!bot) {
        return reply.status(404).send({
            message: "Bot not found",
        });
    }


    if(process.env.DB_COPY_BOT_DISABLED === "true") {
        return reply.status(400).send({
            message: "Bot copying is disabled",
        });
    }

    let bot_api_key: string | undefined

    if (bot.bot_api_key) {
        bot_api_key = generateAPIKey()
    }



    const newBot = await prisma.bot.create({
        data: {
            name: `${bot.name} - Copy`,
            temperature: bot.temperature,
            model: bot.model,
            bot_protect: bot.bot_protect,
            description: bot.description,
            options: bot.options || {},
            embedding: bot.embedding,
            provider: bot.provider,
            qaPrompt: bot.qaPrompt,
            questionGeneratorPrompt: bot.questionGeneratorPrompt,
            showRef: bot.showRef,
            voice_to_text_type: bot.voice_to_text_type,
            haveDataSourcesBeenAdded: bot.haveDataSourcesBeenAdded,
            use_rag: bot.use_rag,
            user_id: request.user.user_id,
            text_to_voice_enabled: bot.text_to_voice_enabled,
            text_to_voice_type: bot.text_to_voice_type,
            streaming: bot.streaming,
            text_to_voice_type_metadata: bot.text_to_voice_type_metadata || {},
            use_hybrid_search: bot.use_hybrid_search,
            bot_api_key,
            bot_model_api_key: bot.bot_model_api_key,
            BotAppearance: {
                createMany: {
                    data: bot.BotAppearance.map((appearance) => {
                        return {
                            bot_name: appearance.bot_name,
                            first_message: appearance.first_message,
                            background_color: appearance.background_color,
                            chat_bot_bubble_style: appearance.chat_bot_bubble_style || {},
                            chat_human_bubble_style: appearance.chat_human_bubble_style || {},
                            id: undefined,
                        }
                    })
                }
            }
        }
    })

    for (const source of bot.source) {
        const newSource = await prisma.botSource.create({
            data: {
                botId: newBot.id,
                content: source.content,
                type: source.type,
                location: source.location,
                options: source.options || {},
                status: source.status,
                isPending: false,
            }
        })

        await prisma.$executeRaw`INSERT INTO "BotDocument" ("sourceId", "content", "embedding", "metadata", "botId")
        SELECT ${newSource.id}, content, embedding::vector, metadata, ${newBot.id}
        FROM "BotDocument"
        WHERE "sourceId" = ${source.id};`
    }


    return {
        message: "Bot copied successfully",
        id: newBot.id,
    }
}