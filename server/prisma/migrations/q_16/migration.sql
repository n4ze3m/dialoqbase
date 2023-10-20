CREATE OR REPLACE FUNCTION update_dialoqbase_models() RETURNS void AS $$
BEGIN

    -- GPT-3.5 Turbo (OpenAI)
    UPDATE "public"."Bot"
    SET "model" = 'gpt-3.5-turbo-dbase'
    WHERE "model" = 'gpt-3.5-turbo';

    -- GPT-3.5 Turbo 16K (OpenAI)
    UPDATE "public"."Bot"
    SET "model" = 'gpt-3.5-turbo-16k-dbase'
    WHERE "model" = 'gpt-3.5-turbo-16k';

    -- GPT-4 (OpenAI)
    UPDATE "public"."Bot"
    SET "model" = 'gpt-4-dbase'
    WHERE "model" = 'gpt-4';

    -- GPT-4 0613 (OpenAI)
    UPDATE "public"."Bot"
    SET "model" = 'gpt-4-0613-dbase'
    WHERE "model" = 'gpt-4-0613';

    -- GPT-3.5 Turbo Instruct (OpenAI)
    UPDATE "public"."Bot"
    SET "model" = 'gpt-3.5-turbo-instruct-dbase'
    WHERE "model" = 'gpt-3.5-turbo-instruct';

    -- Claude 1 (Anthropic)
    UPDATE "public"."Bot"
    SET "model" = 'claude-1-dbase'
    WHERE "model" = 'claude-1';

    -- Claude 2 (Anthropic)
    UPDATE "public"."Bot"
    SET "model" = 'claude-2-dbase'
    WHERE "model" = 'claude-2';

    -- Claude Instant (Anthropic)
    UPDATE "public"."Bot"
    SET "model" = 'claude-instant-1-dbase'
    WHERE "model" = 'claude-instant-1';

    -- Google chat-bison-001
    UPDATE "public"."Bot"
    SET "model" = 'google-bison-dbase'
    WHERE "model" = 'google-bison';

END;
$$ LANGUAGE plpgsql;

-- Execute the function to perform the update
SELECT update_dialoqbase_models();
