-- AlterTable
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Bot' AND column_name = 'autoResetSession') THEN
        ALTER TABLE "Bot" ADD COLUMN "autoResetSession" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Bot' AND column_name = 'inactivityTimeout') THEN
        ALTER TABLE "Bot" ADD COLUMN "inactivityTimeout" INTEGER DEFAULT 3600;
    END IF;
END $$;
