-- AlterTable
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'BotTelegramHistory'
    ) THEN 
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'BotTelegramHistory'
            AND column_name = 'new_chat_id'
        ) THEN 
            ALTER TABLE "BotTelegramHistory" ADD COLUMN "new_chat_id" TEXT;
        END IF;
    END IF;
END $$;
