CREATE TABLE "BotIntegration" (
  "id" serial NOT NULL,
  PRIMARY KEY ("id"),
  "provider" text NOT NULL,
  "bot_id" text NOT NULL,
  "identifier" text NOT NULL,
  "telegram_bot_token" text NULL,
  "is_pause" boolean NULL DEFAULT false
);


ALTER TABLE "BotIntegration"
ADD FOREIGN KEY ("bot_id") REFERENCES "Bot" ("id") ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE "BotTelegramHistory" (
  "id" serial NOT NULL,
  PRIMARY KEY ("id"),
  "chat_id" integer NULL,
  "identifier" text NULL,
  "new_chat_id" text NULL,
  "human" text NULL,
  "bot" text NULL
);