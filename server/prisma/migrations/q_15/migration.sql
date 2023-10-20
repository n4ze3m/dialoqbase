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


-- Insert the default models


INSERT INTO "DialoqbaseModels" ("name", "model_id", "model_type", "model_provider", "stream_available", "local_model", "config") VALUES
('GPT-3.5 Turbo (OpenAI)', 'gpt-3.5-turbo-dbase', 'chat', 'OpenAI', true, false, '{}'),
('GPT-3.5 Turbo 16K (OpenAI)', 'gpt-3.5-turbo-16k-dbase', 'chat', 'OpenAI', true, false, '{}'),
('GPT-4 (OpenAI)', 'gpt-4-dbase', 'chat', 'OpenAI', true, false, '{}'),
('GPT-4 0613 (OpenAI)', 'gpt-4-0613-dbase', 'chat', 'OpenAI', true, false, '{}'),
('GPT-3.5 Turbo Instruct (OpenAI)', 'gpt-3.5-turbo-instruct-dbase', 'instruct', 'openai-instruct', true, false, '{}'),
('Claude 1 (Anthropic)', 'claude-1-dbase', 'chat', 'Anthropic', true, false, '{}'),
('Claude 2 (Anthropic)', 'claude-2-dbase', 'chat', 'Anthropic', true, false, '{}'),
('Claude Instant (Anthropic)', 'claude-instant-1-dbase', 'chat', 'Anthropic', true, false, '{}'),
('Google chat-bison-001', 'google-bison-dbase', 'chat', 'Google', false, false, '{}'),
('Llama v2 7B (Fireworks)', 'accounts/fireworks/models/llama-v2-7b-chat', 'chat', 'Fireworks', true, false, '{}'),
('Llama v2 13B (Fireworks)', 'accounts/fireworks/models/llama-v2-13b-chat', 'chat', 'Fireworks', true, false, '{}'),
('Llama v2 70B (Fireworks)', 'accounts/fireworks/models/llama-v2-70b-chat', 'chat', 'Fireworks', true, false, '{}'),
('Llama v2 7B Chat int8 (Fireworks)', 'accounts/fireworks/models/llama-v2-7b-chat-w8a16', 'chat', 'Fireworks', true, false, '{}'),
('Llama v2 13B Chat int8 (Fireworks)', 'accounts/fireworks/models/llama-v2-13b-chat-w8a16', 'chat', 'Fireworks', true, false, '{}'),
('Llama v2 13B Code Instruct (Fireworks)', 'accounts/fireworks/models/llama-v2-13b-code-instruct', 'instruct', 'Fireworks', true, false, '{}'),
('Llama v2 34B Code Instruct int8 (Fireworks)', 'accounts/fireworks/models/llama-v2-34b-code-instruct-w8a16', 'instruct', 'Fireworks', true, false, '{}'),
('Mistral 7B Instruct 4K (Fireworks)', 'accounts/fireworks/models/mistral-7b-instruct-4k', 'instruct', 'Fireworks', true, false, '{}');


-- Move fireworks model type from existingdata base

CREATE OR REPLACE FUNCTION update_fireworks_bot_model() RETURNS void AS $$
BEGIN
    -- Llama v2 7B (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/llama-v2-7b-chat',
        "provider" = 'Fireworks'
    WHERE "model" = 'llama-v2-7b-chat';

    -- Llama v2 13B (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/llama-v2-13b-chat',
        "provider" = 'Fireworks'
    WHERE "model" = 'llama-v2-13b-chat';

    -- Llama v2 70B (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/llama-v2-70b-chat',
        "provider" = 'Fireworks'
    WHERE "model" = 'llama-v2-70b-chat';

    -- Llama v2 7B Chat int8 (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/llama-v2-7b-chat-w8a16',
        "provider" = 'Fireworks'
    WHERE "model" = 'llama-v2-7b-chat-w8a16';

    -- Llama v2 13B Chat int8 (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/llama-v2-13b-chat-w8a16',
        "provider" = 'Fireworks'
    WHERE "model" = 'llama-v2-13b-chat-w8a16';

    -- Llama v2 13B Code Instruct (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/llama-v2-13b-code-instruct',
        "provider" = 'Fireworks'
    WHERE "model" = 'llama-v2-13b-code-instruct';

    -- Llama v2 34B Code Instruct int8 (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/llama-v2-34b-code-instruct-w8a16',
        "provider" = 'Fireworks'
    WHERE "model" = 'llama-v2-34b-code-instruct-w8a16';

    -- Mistral 7B Instruct 4K (Fireworks)
    UPDATE "public"."Bot"
    SET "model" = 'accounts/fireworks/models/mistral-7b-instruct-4k',
        "provider" = 'Fireworks'
    WHERE "model" = 'mistral-7b-instruct-4k';
    
END;
$$ LANGUAGE plpgsql;

-- Execute the function to perform the update
SELECT update_fireworks_bot_model();
