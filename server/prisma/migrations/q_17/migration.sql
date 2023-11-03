-- AlterTable
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'Bot'
    ) THEN
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'Bot'
            AND column_name = 'bot_model_api_key'
        ) THEN
            ALTER TABLE "Bot" ADD COLUMN "bot_model_api_key" TEXT;
        END IF;
    END IF;
END $$;
