import { PrismaClient } from "@prisma/client";
import { getSettings } from "../utils/common";
import { queue } from "../queue/q";
const prisma = new PrismaClient();

async function processDatasourceCron() {
    try {
        await prisma.$connect();
        const setting = await getSettings(prisma);

        if (!setting.refetchDatasource) {
            return;
        }

        console.log("[CRON] Processing datasource cron");


        const dataSources = await prisma.botSource.findMany({
            where: {
                bot: {
                    autoSyncDataSources: true
                },
                type: {
                    in: [
                        "website",
                        "crawl",
                        "sitemap",
                    ]
                }
            },
            include: {
                bot: true
            }
        })

        for (const dataSource of dataSources) {

            await prisma.botDocument.deleteMany({
                where: {
                    botId: dataSource.botId,
                    sourceId: dataSource.id,
                },
            });
            await queue.add(
                "process",
                [
                    {
                        ...dataSource,
                        embedding: dataSource.bot.embedding,
                    },
                ],
                {
                    jobId: dataSource.id,
                    removeOnComplete: true,
                    removeOnFail: true,
                }
            );
        }


        console.log("[CRON] Finished processing datasource cron");

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

export { processDatasourceCron }; 