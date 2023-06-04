-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatBot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prompt" TEXT,
    "vectorSearchProvider" TEXT DEFAULT 'Faiss',
    "pineconeApiKey" TEXT,
    "pineconeIndexId" TEXT,
    "pineconeEnvironment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ChatBot" ("createdAt", "description", "id", "name", "pineconeApiKey", "pineconeEnvironment", "pineconeIndexId", "prompt", "updatedAt", "vectorSearchProvider") SELECT "createdAt", "description", "id", "name", "pineconeApiKey", "pineconeEnvironment", "pineconeIndexId", "prompt", "updatedAt", "vectorSearchProvider" FROM "ChatBot";
DROP TABLE "ChatBot";
ALTER TABLE "new_ChatBot" RENAME TO "ChatBot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
