import { FastifySchema } from "fastify";


export const userLoginSchema: FastifySchema = {
    body: {
        type: "object",
        required: ["username", "password"],
        properties: {
            username: {
                type: "string",
            },
            password: {
                type: "string",
            },
        },
    },
}

export const updateUsernameSchema: FastifySchema = {
    body: {
        type: "object",
        required: ["username"],
        properties: {
            username: {
                type: "string",
            },
        },
    },
}

export const updatePasswordSchema: FastifySchema = {
    body: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
            oldPassword: {
                type: "string",
            },
            newPassword: {
                type: "string",
            },
        },
    },
}
