import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

import * as Queue from "bull";
import { queueHandler } from "../queue";

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

  queue.process(queueHandler);

  server.decorate("queue", queue);

  server.addHook("onClose", () => {
    queue.close();
  });
});
export default bullPlugin;
