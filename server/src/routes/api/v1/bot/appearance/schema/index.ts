import { FastifySchema } from "fastify";

export const getBotAppearanceByIdSchema: FastifySchema = {
    params: {
        type: "object",
        properties: {
            id: {
                type: "string",
            },
        },
    },

}