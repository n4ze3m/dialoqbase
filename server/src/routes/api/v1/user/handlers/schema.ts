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