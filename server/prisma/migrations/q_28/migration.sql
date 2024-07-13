-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "publicBotPwd" TEXT,
ADD COLUMN     "publicBotPwdHash" TEXT,
ADD COLUMN     "publicBotPwdProtected" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "noOfChatHistoryInContext" SET DEFAULT 0;
