-- CreateTable
CREATE TABLE "UserApiKey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserApiKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserApiKey" ADD CONSTRAINT "UserApiKey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
