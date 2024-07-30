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
      let token = request.headers.authorization

      if(!token) {
        return reply.status(401).send({
          message: "Unauthorized",
        });
      }

      token = token.replace("Bearer ", "");

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

  async function authenticateAdmin(request: FastifyRequest, reply: FastifyReply) {
    try {
      await authenticate(request, reply)

      if (!request.user || !request.user.is_admin) {
        return reply.status(403).send({
          message: "Forbidden: Admin access required",
        })
      }
    } catch (err) {
      reply.send(err)
    }
  }

  async function authenticateOpenAI(request: FastifyRequest, reply: FastifyReply) {
      try {
        let token = request.headers.authorization;
        if (!token) {
          return reply.status(401).send({
            error: {
              message: "Invalid API key",
              type: "invalid_request_error",
              param: null,
              code: "invalid_api_key"
            }
          });
        }

        token = token.replace("Bearer ", "");


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
              error: {
                message: "Invalid API key",
                type: "invalid_request_error",
                param: null,
                code: "invalid_api_key"
              }
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
            return reply.status(401).send({
              error: {
                message: "Invalid API key",
                type: "invalid_request_error",
                param: null,
                code: "invalid_api_key"
              }
            });
          }
          request.user = {
            user_id: user.user_id,
            username: user.username,
            is_admin: user.isAdministrator,
          };
        }
      } catch (err) {
        return reply.status(500).send({
          error: {
            message: err.message,
            type: "internal_server_error",
            param: null,
            code: "internal_server_error"
          }
        });
    }
  }

  fastify.decorate("authenticateAdmin", authenticateAdmin)


  fastify.decorate("authenticate", authenticate);

  fastify.decorate("authenticateOpenAI", authenticateOpenAI);

});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<undefined>;

    authenticateAdmin(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<undefined>;

    authenticateOpenAI(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<undefined>;
  }
}
