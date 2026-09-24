-- Run in Supabase SQL Editor on the PUBLIC schema (production)
-- Fixes 500 errors on /tasks and /calendar/events after productionPhase feature

DO $$ BEGIN
    CREATE TYPE "ProductionPhase" AS ENUM ('ROTEIRO', 'EM_GRAVACAO');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "KanbanTask" ADD COLUMN IF NOT EXISTS "productionPhase" "ProductionPhase";

UPDATE "KanbanTask"
SET "productionPhase" = 'ROTEIRO'
WHERE "status" = 'FALTA_GRAVAR'
  AND "productionPhase" IS NULL;
