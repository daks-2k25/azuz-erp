CREATE TABLE "app_updates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "visibleRoles" "RoleName"[],
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL DEFAULT '00000000-0000-4000-8000-000000000001',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_updates_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "app_updates_companyId_idx" ON "app_updates"("companyId");
CREATE INDEX "app_updates_created_by_id_idx" ON "app_updates"("created_by_id");
CREATE INDEX "app_updates_is_published_idx" ON "app_updates"("is_published");

ALTER TABLE "app_updates" ADD CONSTRAINT "app_updates_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "app_updates" ADD CONSTRAINT "app_updates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
