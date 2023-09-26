-- CreateTable
CREATE TABLE "botWebHistory" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "metadata" JSONB,
    "sources" JSONB,
    "human" TEXT,
    "bot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "botWebHistory_pkey" PRIMARY KEY ("id")
);
