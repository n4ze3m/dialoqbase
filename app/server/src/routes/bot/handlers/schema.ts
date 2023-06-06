import { FastifySchema } from "fastify";

export const chatRequestSchema: FastifySchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "string",
            },
        },
    },
    body: {
        type: "object",
        required: ["message",],
        properties: {
            message: {
                type: "string",
            },
            history: {
                type: "array",
            },
        },
    },
};