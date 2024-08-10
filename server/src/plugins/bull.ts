import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { Queue } from "bullmq";
import { queue } from "../queue/q";
declare module "fastify" {
  interface FastifyInstance {
    queue: Queue<any>;
  }
}

const bullPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const redis_url = process.env.DB_REDIS_URL || process.env.REDIS_URL;
  if (!redis_url) {
    throw new Error("Redis url is not defined");
  }

  server.decorate("queue", queue);

  server.addHook("onClose", () => {
    queue.close();
  });
});
export default bullPlugin;
