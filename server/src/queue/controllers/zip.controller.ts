import { QSource } from "../type";
import { PrismaClient } from "@prisma/client";
import yauzl from "yauzl-promise"
import * as fs from "fs"
import * as util from "util";
import path from "path"
import { pipeline } from "stream/promises";
import { fileTypeFinder } from "../../utils/fileType";
import { queue } from "../q";
const pump = util.promisify(pipeline);

function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case ".pdf":
            return "application/pdf";
        case ".docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case ".csv":
            return "text/csv";
        case ".txt":
            return "text/plain";
        case ".mp4":
            return "video/mp4";
        case ".mp3":
            return "audio/mpeg";
        case ".zip":
            return "application/zip";
        case ".json":
            return "application/json";
        default:
            return "none";
    }
}

interface UnzippedFile {
    name: string;
    mimeType: string;
    location: string;
    type: string;
}

async function unzip(zipFilePath: string): Promise<UnzippedFile[]> {
    const unzipPath = `${zipFilePath.replace(".zip", "")}-${Date.now()}`
    await fs.promises.mkdir(unzipPath, { recursive: true });

    const zip = await yauzl.open(zipFilePath);

    const unzippedFiles: UnzippedFile[] = [];

    try {
        for await (const entry of zip) {
            const entryPath = `${unzipPath}/${entry.filename}`;
            if (entry.filename.endsWith('/')) {
                await fs.promises.mkdir(entryPath, { recursive: true });
            } else {
                const dirName = path.dirname(entryPath);
                await fs.promises.mkdir(dirName, { recursive: true });

                const readStream = await entry.openReadStream();
                const mimeType = getMimeType(entry.filename);

                const writeStream = fs.createWriteStream(entryPath);
                //@ts-ignore
                await pump(readStream, writeStream);

                unzippedFiles.push({
                    name: entry.filename,
                    mimeType,
                    location: entryPath,
                    type: fileTypeFinder(mimeType)
                });
            }
        }
    } finally {
        await zip.close();
    }

    return unzippedFiles;
}

export const zipQueueController = async (
    source: QSource,
    prisma: PrismaClient
) => {
    console.log("loading zip");

    const location = source.location!;
    const fileInfo = await unzip(location);
    const validFiles = fileInfo.filter(file => file.type !== "none");
    console.log("validFiles", validFiles.length);

    for (const file of validFiles) {
        const botSource = await prisma.botSource.create({
            data: {
                botId: source.botId,
                content: file.name,
                type: file.type,
                location: file.location,
            }
        })

        queue.add(
            "process",
            [
                {
                    ...botSource,
                    embedding: source.embedding,
                },
            ],
            {
                jobId: botSource.id,
                removeOnComplete: true,
                removeOnFail: true,
            }
        );
    }
    console.log("zip loaded");
};
