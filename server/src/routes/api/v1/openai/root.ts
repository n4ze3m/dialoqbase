import { FastifyPluginAsync } from "fastify";
import { createChatCompletionSchema } from "../../../../schema/api/v1/openai";
import { createChatCompletionHandler } from "../../../../handlers/api/v1/openai/chat.handler";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
    fastify.post(
        "/chat/completions",
        {
            schema: createChatCompletionSchema,
            onRequest: [fastify.authenticateOpenAI],
        },
        createChatCompletionHandler
    );
}

export default root;