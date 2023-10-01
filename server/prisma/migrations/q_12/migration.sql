/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN "user_id" INTEGER;

ALTER TABLE "Bot" ADD COLUMN "haveDataSourcesBeenAdded" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
    
ALTER TABLE "User" ADD COLUMN  "email" TEXT,  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isAdministrator" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DialoqbaseSettings" (
    "id" SERIAL NOT NULL,
    "noOfBotsPerUser" INTEGER NOT NULL DEFAULT 10,
    "allowUserToCreateBots" BOOLEAN NOT NULL DEFAULT true,
    "allowUserToRegister" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DialoqbaseSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Make Existing Users Admins
UPDATE "User" SET "isAdministrator" = true;

-- Move all exisiting bots to the first user or existing user

UPDATE "Bot" 
SET "user_id" = (
  SELECT "user_id" FROM "User" WHERE "isAdministrator" = true LIMIT 1
)
WHERE "user_id" IS NULL
AND EXISTS (
  SELECT 1 FROM "User" WHERE "isAdministrator" = true
);

-- Create Default Settings 

INSERT INTO "DialoqbaseSettings" ("id", "noOfBotsPerUser", "allowUserToCreateBots", "allowUserToRegister")
VALUES (1,'10', '1', '0');