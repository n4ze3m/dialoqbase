import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { Queue } from "bullmq";
import { parseRedisUrl } from "../utils/redis";
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
  const { host, port, password } = parseRedisUrl(redis_url);

  const queue = new Queue("vector", {
    connection: {
      host,
      port,
      password,
      username: process?.env?.DB_REDIS_USERNAME,
    },
  });

  server.decorate("queue", queue);

  server.addHook("onClose", () => {
    queue.close();
  });
});
export default bullPlugin;
