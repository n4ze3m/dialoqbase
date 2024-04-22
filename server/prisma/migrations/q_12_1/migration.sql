-- AlterTable
ALTER TABLE "DialoqbaseSettings" ADD COLUMN     "hidePlayground" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "legacyMode" BOOLEAN NOT NULL DEFAULT false;
