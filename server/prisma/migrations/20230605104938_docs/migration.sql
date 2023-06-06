-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotSource" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'website',
    "content" TEXT,
    "location" TEXT,
    "isPending" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotDocument" (
    "id" SERIAL NOT NULL,
    "sourceId" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "BotDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_publicId_key" ON "Bot"("publicId");

-- AddForeignKey
ALTER TABLE "BotSource" ADD CONSTRAINT "BotSource_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotDocument" ADD CONSTRAINT "BotDocument_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotDocument" ADD CONSTRAINT "BotDocument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "BotSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
