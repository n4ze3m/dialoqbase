-- CreateTable
CREATE TABLE "BotApiHistory" (
    "id" SERIAL NOT NULL,
    "api_key" TEXT NOT NULL,
    "bot_id" TEXT,
    "human" TEXT,
    "bot" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotApiHistory_pkey" PRIMARY KEY ("id")
);
