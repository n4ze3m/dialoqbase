import { PrismaClient } from "@prisma/client";

export const getSettings = (prisma: PrismaClient) => {
  const settings = prisma.dialoqbaseSettings.findFirst({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    throw new Error("Settings not found");
  }

  return settings;
};
