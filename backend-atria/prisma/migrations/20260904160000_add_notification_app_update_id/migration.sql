ALTER TABLE "notifications" ADD COLUMN "app_update_id" TEXT;

CREATE INDEX "notifications_app_update_id_idx" ON "notifications"("app_update_id");
