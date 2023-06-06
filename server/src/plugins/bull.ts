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
  const queue = new Queue("vector", process.env.DB_REDIS_URL!, {});

  await queue.isReady();

  queue.process(queueHandler);

  server.decorate("queue", queue);

  server.addHook("onClose", () => {
    queue.close();
  });
});
export default bullPlugin;
