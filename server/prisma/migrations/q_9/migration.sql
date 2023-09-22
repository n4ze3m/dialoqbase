-- AlterTable
ALTER TABLE "BotIntegration" ADD COLUMN     "slack_auth_token" TEXT,
ADD COLUMN     "slack_signing_secret" TEXT, ADD COLUMN     "slack_app_token" TEXT;

ALTER TABLE "Bot"
ADD "voice_to_text_type" text NOT NULL DEFAULT 'web_api',
ADD "text_to_voice_enabled" boolean NOT NULL DEFAULT false,
ADD "text_to_voice_type" text NOT NULL DEFAULT 'web_api',
ADD "text_to_voice_type_metadata" json NOT NULL DEFAULT '{}';