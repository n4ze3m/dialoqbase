ALTER TABLE "BotIntegration"
ADD "discord_bot_token" text NULL,
ADD "discord_slash_command" text NULL DEFAULT 'hey',
ADD "discord_slash_command_description" text NULL DEFAULT 'Use this command to get help',
ADD "discord_application_id" text NULL;

CREATE TABLE "BotDiscordHistory" (
  "id" serial NOT NULL,
  PRIMARY KEY ("id"),
  "chat_id" text NULL,
  "identifier" text NULL,
  "human" text NULL,
  "bot" text NULL
);