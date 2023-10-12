import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import { FastifySSEPlugin } from "@waylaidwanderer/fastify-sse-v2";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { getSessionSecret, isCookieSecure } from "./utils/session";

declare module "fastify" {
  interface Session {
    is_bot_allowed: boolean;
  }
}

export type AppOptions = {} & Partial<AutoloadPluginOptions>;

const options: AppOptions = {};

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
    },
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

  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    secret: getSessionSecret(),
    cookie: {
      secure: isCookieSecure(),
    },
  });

  await fastify.register(import("fastify-raw-body"), {
    field: "rawBody", // change the default request.rawBody property name
    global: false, // add the rawBody to every request. **Default true**
    encoding: "utf8", // set it to false to set rawBody as a Buffer **Default utf8**
    runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
    routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
  });
};

export default app;
export { app, options };
