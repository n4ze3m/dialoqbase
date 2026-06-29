import { FastifyPluginAsync } from "fastify";
import * as fs from "fs/promises";
import { resolve, sep } from "path";

// All user-uploaded assets are written to `./uploads/` relative to the
// process working directory (see upload.handler.ts). Confine every read to
// that directory so a wildcard like `../../../etc/passwd` cannot escape it.
const UPLOADS_DIR = resolve(process.cwd(), "uploads");

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get(
    "/*",
    {
      schema: {
        hide: true,
      },
    },
    async (request, reply) => {
      try {
        //@ts-ignore
        const filePath: string = request.params["*"] || "";

        // Strip any leading reference to the uploads dir the client may send
        // (e.g. "uploads/x", "./uploads/x" or "app/uploads/x") so the path is
        // always resolved relative to UPLOADS_DIR.
        const requested = filePath.replace(/^(\.\/)?(app\/)?uploads\//, "");

        // Resolve and ensure the result stays inside UPLOADS_DIR. resolve()
        // collapses any `..` segments, so the prefix check below rejects every
        // traversal attempt.
        const path = resolve(UPLOADS_DIR, requested);
        if (path !== UPLOADS_DIR && !path.startsWith(UPLOADS_DIR + sep)) {
          return reply.status(404).send("Not Found");
        }

        const file = await fs.readFile(path);
        const ext = requested.split(".").pop();
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
    }
  );
};

export default root;
