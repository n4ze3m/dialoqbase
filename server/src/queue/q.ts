import { Queue } from "bullmq";
import { parseRedisUrl } from "../utils/redis";

const redis_url = process.env.DB_REDIS_URL || process.env.REDIS_URL;
if (!redis_url) {
    throw new Error("Redis url is not defined");
}

//@ts-ignore
const { host, port, password } = parseRedisUrl(redis_url);

export const queue = new Queue("vector", {
    connection: {
        host,
        port,
        password,
        username: process?.env?.DB_REDIS_USERNAME,
    },
});
