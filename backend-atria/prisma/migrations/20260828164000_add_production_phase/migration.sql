-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ProductionPhase" AS ENUM ('ROTEIRO', 'EM_GRAVACAO');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "KanbanTask" ADD COLUMN IF NOT EXISTS "productionPhase" "ProductionPhase";

-- Backfill tasks in Em produção
UPDATE "KanbanTask"
SET "productionPhase" = 'ROTEIRO'
WHERE "status" = 'FALTA_GRAVAR'
  AND "productionPhase" IS NULL;
