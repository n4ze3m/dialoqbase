import fp from "fastify-plugin";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      user_id: number;
      username: string;
      is_admin: boolean;
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

  async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.headers.authorization;
      if (token && token.startsWith("db_")) {
        const apiKey = await fastify.prisma.userApiKey.findFirst({
          where: {
            api_key: token,
          },
          include: {
            User: true,
          },
        });

        if (!apiKey) {
          return reply.status(401).send({
            message: "Unauthorized",
          });
        }
        request.user = {
          user_id: apiKey.User.user_id,
          username: apiKey.User.username,
          is_admin: apiKey.User.isAdministrator,
        };
      } else {
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
        request.user = {
          user_id: user.user_id,
          username: user.username,
          is_admin: user.isAdministrator,
        };
      }
    } catch (err) {
      reply.send(err);
    }
  }
  fastify.decorate("authenticate", authenticate);
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<undefined>;
  }
}
