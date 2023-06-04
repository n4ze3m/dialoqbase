-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChatBot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prompt" TEXT,
    "vectorSearchProvider" TEXT DEFAULT 'Chroma',
    "pineconeApiKey" TEXT,
    "pineconeIndexId" TEXT,
    "pineconeEnvironment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChatBotKnowledge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatBotId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'WEBSITE',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatBotKnowledge_chatBotId_fkey" FOREIGN KEY ("chatBotId") REFERENCES "ChatBot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
