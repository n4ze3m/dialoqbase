-- CreateTable
CREATE TABLE "DialoqbaseModels" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "model_id" TEXT NOT NULL,
    "model_type" TEXT NOT NULL DEFAULT 'chat',
    "model_provider" TEXT,
    "stream_available" BOOLEAN NOT NULL DEFAULT false,
    "local_model" BOOLEAN NOT NULL DEFAULT false,
    "config" JSON NOT NULL DEFAULT '{}',
    "hide" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DialoqbaseModels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DialoqbaseModels_model_id_key" ON "DialoqbaseModels"("model_id");