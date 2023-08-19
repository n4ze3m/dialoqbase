import { FastifyPluginAsync } from "fastify";
import { chatRequestHandler, chatRequestStreamHandler } from "./handlers";
import { chatRequestSchema, chatRequestStreamSchema } from "./schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/:id", {
    schema: chatRequestSchema,
    onRequest: [fastify.authenticate],
  }, chatRequestHandler);

  fastify.post("/:id/stream", {
    schema: chatRequestStreamSchema,
    onRequest: [fastify.authenticate],
    logLevel: "silent",
  }, chatRequestStreamHandler);

  // fastify.addHook("onResponse", async (request, reply) => {
  //   console.log(request.body);
  //   //  log response
  //   console.log(reply.raw)
  // });
};

export default root;
