-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "SystemSuggestionType" AS ENUM ('BUG', 'SUGGESTION');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "SystemSuggestionStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "system_suggestions" (
    "id" TEXT NOT NULL,
    "type" "SystemSuggestionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "SystemSuggestionStatus" NOT NULL DEFAULT 'OPEN',
    "submitted_by_id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL DEFAULT '00000000-0000-4000-8000-000000000001',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "system_suggestions_companyId_idx" ON "system_suggestions"("companyId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "system_suggestions_submitted_by_id_idx" ON "system_suggestions"("submitted_by_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "system_suggestions_status_idx" ON "system_suggestions"("status");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "system_suggestions" ADD CONSTRAINT "system_suggestions_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "system_suggestions" ADD CONSTRAINT "system_suggestions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
