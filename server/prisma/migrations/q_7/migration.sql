-- CreateTable
CREATE TABLE "BotPlayground" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotPlayground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotPlaygroundMessage" (
    "id" TEXT NOT NULL,
    "botPlaygroundId" TEXT NOT NULL,
    "type" text not null,
    "message" text not null,
    "isBot" boolean not null default false,
    "sources" jsonb null,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotPlaygroundMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotPlayground" ADD CONSTRAINT "BotPlayground_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotPlaygroundMessage" ADD CONSTRAINT "BotPlaygroundMessage_botPlaygroundId_fkey" FOREIGN KEY ("botPlaygroundId") REFERENCES "BotPlayground"("id") ON DELETE CASCADE ON UPDATE CASCADE;
