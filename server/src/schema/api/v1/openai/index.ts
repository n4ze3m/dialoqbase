import type { FastifySchema } from "fastify";

export const createChatCompletionSchema: FastifySchema = {
    tags: ["OpenAI"],
    body: {
        type: "object",
        required: ["messages", "model"],
        properties: {
            messages: {
                type: "array",
                items: {
                    type: "object",
                    required: ["role", "content"],
                    properties: {
                        role: {
                            type: "string",
                            enum: ["user", "assistant"]
                        },
                        content: {
                            type: "string"
                        }
                    }
                }
            },
            model: {
                type: "string"
            },
            stream: {
                type: "boolean"
            },
            temperature: {
                type: "number"
            }
        }
    }
}