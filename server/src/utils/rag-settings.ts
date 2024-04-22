import { PrismaClient } from "@prisma/client";

export const getRagSettings = async (prisma: PrismaClient) => {
  const data = await prisma.dialoqbaseSettings.findFirst({
    select: {
      defaultChunkSize: true,
      defaultChunkOverlap: true,
    },
  });

  return {
    chunkSize: data?.defaultChunkSize || 1000,
    chunkOverlap: data?.defaultChunkOverlap || 200,
  };
};
