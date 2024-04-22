import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { Queue } from "bullmq";
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
  const username = redis_url.split(":")[1].replace("//", "");
  const password = redis_url.split(":")[2].split("@")[0];
  const host = redis_url.split("@")[1].split(":")[0];
  const port = parseInt(redis_url.split(":")[3]);

  const queue = new Queue("vector", {
    connection: {
      host,
      port,
      password,
      username,
    },
  });

  server.decorate("queue", queue);

  server.addHook("onClose", () => {
    queue.close();
  });
});
export default bullPlugin;
