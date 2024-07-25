-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "autoResetSession" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inactivityTimeout" INTEGER DEFAULT 3600;
