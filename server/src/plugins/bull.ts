import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

import * as Queue from "bull";
import { join } from "path";

declare module "fastify" {
  interface FastifyInstance {
    queue: Queue.Queue<any>;
  }
}

const bullPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const redis_url = process.env.DB_REDIS_URL || process.env.REDIS_URL;
  if (!redis_url) {
    throw new Error("Redis url is not defined");
  }
  const queue = new Queue("vector", redis_url, {});

  await queue.isReady();
  const path = join(__dirname, "../queue/index.js");
  const concurrency = parseInt(process.env.DB_QUEUE_CONCURRENCY || "1");
  queue.process(concurrency, path);

  server.decorate("queue", queue);

  server.addHook("onClose", () => {
    queue.close();
  });
});
export default bullPlugin;
