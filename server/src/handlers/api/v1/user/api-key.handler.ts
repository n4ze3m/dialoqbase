import { FastifyReply, FastifyRequest } from "fastify";
import { CreateNewApiKey, DeleteApiKey } from "./types"
import { generateDialoqbaseAPIKey } from "../../../../utils/api";



export const getAllApiKeyByUser = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const user = request.user;
    const prisma = request.server.prisma;


    const apiKeys = await prisma.userApiKey.findMany({
        where: {
            user_id: user.user_id
        }
    })


    return {
        data: apiKeys.map(apiKey => {
            return {
                ...apiKey,
                api_key: `${apiKey.api_key.slice(0, 7)}...${apiKey.api_key.slice(-4)}`,
            }
        })
    }
}


export const createNewApiKey = async (
    request: FastifyRequest<CreateNewApiKey>,
    reply: FastifyReply,
) => {
    const user = request.user;
    const { name } = request.body;

    const prisma = request.server.prisma;

    const apiKey = generateDialoqbaseAPIKey()

    const newApiKey = await prisma.userApiKey.create({
        data: {
            user_id: user.user_id,
            name,
            api_key: apiKey
        }
    })

    return {
        data: {
            api_key: newApiKey.api_key,
        }
    }
}


export const deleteApiKey = async (
    request: FastifyRequest<DeleteApiKey>,
    reply: FastifyReply,
) => {
    const user = request.user;
    const { id } = request.params;

    const prisma = request.server.prisma;

    const apiKey = await prisma.userApiKey.findFirst({
        where: {
            id,
            user_id: user.user_id
        }
    })

    if (!apiKey) {
        return reply.status(404).send({
            message: "API Key not found"
        })

    }

    await prisma.userApiKey.delete({
        where: {
            id
        }
    })

    return {
        data: {
            message: "API Key deleted"
        }
    }
}

