import { FastifyPluginAsync } from "fastify";
import * as fs from "fs/promises";
import { join } from "path";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get("/*", async (request, reply) => {
    try {
      //@ts-ignore
      const filePath = request.params["*"];
      const path = join(__dirname, `../../../../../${filePath}`);
      const file = await fs.readFile(path);
      const ext = filePath.split(".").pop();
      // set content type
      if (ext === "pdf") {
        reply.header("Content-Type", "application/pdf");
      } else if (ext === "mp3") {
        reply.header("Content-Type", "audio/mpeg");
      } else if (ext === "mp4") {
        reply.header("Content-Type", "video/mp4");
      } else if (ext === "png" || ext === "jpg" || ext === "jpeg") {
        reply.header("Content-Type", "image/jpeg");
      } else if (ext === "json") {
        reply.header("Content-Type", "application/json");
      } else {
        reply.header("Content-Type", "text/plain");
      }
      return file;
    } catch (error) {
      return reply.status(404).send("Not Found");
    }
  });
};

export default root;
