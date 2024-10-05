import { FastifyReply, FastifyRequest } from "fastify";
import { SearchRequest } from "./types";
import { getModelInfo } from "../../../../../utils/get-model-info";
import { embeddings } from "../../../../../utils/embeddings";
import { DialoqbaseVectorStore } from "../../../../../utils/store";
import { getSettings } from "../../../../../utils/common";
export function removeUUID(filename: string) {
    return filename.replace(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}-/, "");
}

export const aiSearhRequestHandler = async (
    request: FastifyRequest<SearchRequest>,
    reply: FastifyReply
) => {
    try {
        const { query, total_results } = request.body;
        const bot_id = request.params.id;
        const user = request.user;
        const prisma = request.server.prisma;

        const setting = await getSettings(prisma);

        if (!setting.internalSearchEnabled) {
            return reply.status(400).send({ message: "Internal search is not enabled" });
        }

        const bot = await prisma.bot.findFirst({
            where: { id: bot_id, user_id: !user.is_admin ? user.user_id : undefined },
        });

        if (!bot) {
            return reply.status(404).send({ message: "Bot not found" });
        }

        const embeddingInfo = await getModelInfo({
            model: bot.embedding,
            prisma,
            type: "embedding",
        });

        if (!embeddingInfo) {
            return reply.status(404).send({ message: "Embedding model not found" });
        }

        const embeddingModel = embeddings(
            embeddingInfo.model_provider!.toLowerCase(),
            embeddingInfo.model_id,
            embeddingInfo?.config
        );
        const vectorstore = await DialoqbaseVectorStore.fromExistingIndex(
            embeddingModel,
            { botId: bot.id, sourceId: null }
        );

        const results = await vectorstore.similaritySearchV2(query, total_results);

        return results;
    } catch (e) {
        console.log(e);
        return reply.status(500).send({ message: "Internal server error" });
    }
};
