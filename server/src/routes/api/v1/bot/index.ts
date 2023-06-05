import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
    fastify.get("/", async function (request, reply) {
        await request.server.queue.add({ hello: "world" });
        return { hello: "world" };
    });
};


export default root;