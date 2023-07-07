import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import {FastifySSEPlugin} from "@waylaidwanderer/fastify-sse-v2";

export type AppOptions = {} & Partial<AutoloadPluginOptions>;

const options: AppOptions = {
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  void fastify.register(cors);

  void fastify.register(FastifySSEPlugin);

  void fastify.register(fastifyMultipart, {
    limits: {
      files: 10,
      fileSize: 100 * 1024 * 1024,
    }
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  fastify.register(fastifyStatic, {
    root: join(__dirname, "public"),
    preCompressed: true,
  });
};

export default app;
export { app, options };
