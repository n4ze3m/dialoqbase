
-- AlterTable
ALTER TABLE "BotIntegration" ADD COLUMN     "whatsapp_access_token" TEXT,
ADD COLUMN     "whatsapp_verify_token" TEXT;


ALTER TABLE "BotIntegration" ADD COLUMN     "whatsapp_phone_number" TEXT;


CREATE TABLE "BotWhatsappHistory" (
  "id" serial NOT NULL,
  PRIMARY KEY ("id"),
  "chat_id" text NULL,
  "from" text NULL,
  "identifier" text NULL,
  "human" text NULL,
  "bot" text NULL
);
