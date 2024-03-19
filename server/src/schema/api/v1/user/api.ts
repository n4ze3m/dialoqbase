import { FastifySchema } from "fastify";


export const getAllApiKeyByUserSchema: FastifySchema = {
    tags: ["User"],
    summary: "Get all api keys by user",
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            name: { type: "string" },
                            api_key: { type: "string" },
                            createdAt: { type: "string"},                        },
                    },
                },
            },
        },
    },
};


export const createNewApiKeySchema: FastifySchema = {
    tags: ["User"],
    summary: "Create new api key",
    body: {
        type: "object",
        required: ["name"],
        properties: {
            name: { type: "string" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        api_key: { type: "string" },
                    },
                },
            },
        },
    },
};


export const deleteApiKeySchema: FastifySchema = {
    tags: ["User"],
    summary: "Delete api key",
    params: {
        type: "object",
        properties: {
            id: { type: "number" },
        },
    },
};