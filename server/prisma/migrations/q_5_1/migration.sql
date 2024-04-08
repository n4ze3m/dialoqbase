-- AlterTable
ALTER TABLE "BotAppearance" ADD COLUMN     "tts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tts_provider" TEXT,
ADD COLUMN     "tts_voice" TEXT;
