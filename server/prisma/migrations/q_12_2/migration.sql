-- AlterTable
ALTER TABLE "DialoqbaseSettings" ADD COLUMN     "defaultChatModel" TEXT NOT NULL DEFAULT 'gpt-3.5-turbo-dbase',
ADD COLUMN     "defaultChunkOverlap" INTEGER DEFAULT 200,
ADD COLUMN     "defaultChunkSize" INTEGER DEFAULT 1000,
ADD COLUMN     "defaultEmbeddingModel" TEXT NOT NULL DEFAULT 'dialoqbase_eb_text-embedding-ada-002',
ADD COLUMN     "dynamicallyFetchOllamaModels" BOOLEAN DEFAULT false,
ADD COLUMN     "hideDefaultModels" BOOLEAN DEFAULT false;
