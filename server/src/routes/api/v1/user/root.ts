import { FastifyPluginAsync } from "fastify";
import { userLoginHandler } from "./handlers";
import {
    userLoginSchema
} from "./handlers/schema";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post("/login", {
    schema: userLoginSchema,
    }, userLoginHandler);
    
};

export default root;
