-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "noOfChatHistoryInContext" INTEGER DEFAULT 15,
ADD COLUMN     "semanticSearchSimilarityScore" TEXT DEFAULT 'none';
