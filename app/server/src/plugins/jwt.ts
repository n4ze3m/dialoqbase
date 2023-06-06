import fp from "fastify-plugin";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      user_id: number;
      username: string;
    };
  }
}

export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: process.env.DB_SECRET_KEY!,
    sign: {
      expiresIn: "7d",
    },
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
        const { user_id } = request.user;

        const user = await fastify.prisma.user.findUnique({
          where: {
            user_id,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }
      } catch (err) {
        reply.send(err);
      }
    },
  );
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate(): Promise<void>;
  }
}
