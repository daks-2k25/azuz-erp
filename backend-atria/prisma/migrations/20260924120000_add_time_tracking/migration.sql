-- Enums
CREATE TYPE "EmploymentType" AS ENUM ('CLT');
CREATE TYPE "TimeClockEntryType" AS ENUM ('CLOCK_IN', 'BREAK_START', 'BREAK_END', 'CLOCK_OUT');
CREATE TYPE "TimeClockEntryOrigin" AS ENUM ('EMPLOYEE', 'ADJUSTMENT');
CREATE TYPE "TimeAdjustmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Jornadas
CREATE TABLE "work_schedules" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reminder_tolerance_minutes" INTEGER NOT NULL DEFAULT 15,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_schedules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "work_schedules_reminder_tolerance_check" CHECK ("reminder_tolerance_minutes" BETWEEN 0 AND 120)
);

-- Horários de cada dia da jornada (weekday ISO: 1 = segunda ... 7 = domingo; horários em minutos desde 00:00)
CREATE TABLE "work_schedule_days" (
    "id" TEXT NOT NULL,
    "work_schedule_id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_minutes" INTEGER NOT NULL,
    "break_start_minutes" INTEGER NOT NULL,
    "break_end_minutes" INTEGER NOT NULL,
    "end_minutes" INTEGER NOT NULL,

    CONSTRAINT "work_schedule_days_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "work_schedule_days_weekday_check" CHECK ("weekday" BETWEEN 1 AND 7),
    CONSTRAINT "work_schedule_days_time_order_check" CHECK (
        "start_minutes" >= 0
        AND "start_minutes" < "break_start_minutes"
        AND "break_start_minutes" < "break_end_minutes"
        AND "break_end_minutes" < "end_minutes"
        AND "end_minutes" <= 1440
    )
);

-- Dados trabalhistas (só quem tem registro ativo aqui bate ponto)
CREATE TABLE "employee_profiles" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "employment_type" "EmploymentType" NOT NULL DEFAULT 'CLT',
    "admission_date" DATE NOT NULL,
    "work_schedule_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_profiles_pkey" PRIMARY KEY ("id")
);

-- Contador sequencial de marcações por empresa (NSR)
CREATE TABLE "time_clock_counters" (
    "company_id" TEXT NOT NULL,
    "last_sequence_number" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "time_clock_counters_pkey" PRIMARY KEY ("company_id")
);

-- Pedidos de ajuste
CREATE TABLE "time_adjustment_requests" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "employee_profile_id" TEXT NOT NULL,
    "work_date" DATE NOT NULL,
    "entry_type" "TimeClockEntryType" NOT NULL,
    "requested_time" TIMESTAMP(3) NOT NULL,
    "replaces_entry_id" TEXT,
    "reason" TEXT NOT NULL,
    "status" "TimeAdjustmentStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_adjustment_requests_pkey" PRIMARY KEY ("id")
);

-- Marcações (somente inserção)
CREATE TABLE "time_clock_entries" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "employee_profile_id" TEXT NOT NULL,
    "sequence_number" BIGINT NOT NULL,
    "entry_type" "TimeClockEntryType" NOT NULL,
    "work_date" DATE NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "origin" "TimeClockEntryOrigin" NOT NULL DEFAULT 'EMPLOYEE',
    "adjustment_request_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_clock_entries_pkey" PRIMARY KEY ("id")
);

-- Lembretes já enviados (evita repetir)
CREATE TABLE "time_clock_reminders" (
    "id" TEXT NOT NULL,
    "employee_profile_id" TEXT NOT NULL,
    "work_date" DATE NOT NULL,
    "entry_type" "TimeClockEntryType" NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_clock_reminders_pkey" PRIMARY KEY ("id")
);

-- Índices
CREATE UNIQUE INDEX "work_schedules_company_id_name_key" ON "work_schedules"("company_id", "name");
CREATE UNIQUE INDEX "work_schedule_days_work_schedule_id_weekday_key" ON "work_schedule_days"("work_schedule_id", "weekday");
CREATE UNIQUE INDEX "employee_profiles_user_id_key" ON "employee_profiles"("user_id");
CREATE INDEX "employee_profiles_company_id_is_active_idx" ON "employee_profiles"("company_id", "is_active");
CREATE UNIQUE INDEX "time_clock_entries_company_id_sequence_number_key" ON "time_clock_entries"("company_id", "sequence_number");
CREATE UNIQUE INDEX "time_clock_entries_adjustment_request_id_key" ON "time_clock_entries"("adjustment_request_id");
CREATE INDEX "time_clock_entries_employee_profile_id_work_date_idx" ON "time_clock_entries"("employee_profile_id", "work_date");
CREATE INDEX "time_adjustment_requests_company_id_status_idx" ON "time_adjustment_requests"("company_id", "status");
CREATE INDEX "time_adjustment_requests_employee_profile_id_work_date_idx" ON "time_adjustment_requests"("employee_profile_id", "work_date");
CREATE UNIQUE INDEX "time_clock_reminders_employee_profile_id_work_date_entry_ty_key" ON "time_clock_reminders"("employee_profile_id", "work_date", "entry_type");

-- Chaves estrangeiras
ALTER TABLE "work_schedules" ADD CONSTRAINT "work_schedules_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_schedule_days" ADD CONSTRAINT "work_schedule_days_work_schedule_id_fkey" FOREIGN KEY ("work_schedule_id") REFERENCES "work_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_profiles" ADD CONSTRAINT "employee_profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_profiles" ADD CONSTRAINT "employee_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "employee_profiles" ADD CONSTRAINT "employee_profiles_work_schedule_id_fkey" FOREIGN KEY ("work_schedule_id") REFERENCES "work_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "time_clock_counters" ADD CONSTRAINT "time_clock_counters_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "time_adjustment_requests" ADD CONSTRAINT "time_adjustment_requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "time_adjustment_requests" ADD CONSTRAINT "time_adjustment_requests_employee_profile_id_fkey" FOREIGN KEY ("employee_profile_id") REFERENCES "employee_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "time_adjustment_requests" ADD CONSTRAINT "time_adjustment_requests_replaces_entry_id_fkey" FOREIGN KEY ("replaces_entry_id") REFERENCES "time_clock_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "time_adjustment_requests" ADD CONSTRAINT "time_adjustment_requests_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "time_clock_entries" ADD CONSTRAINT "time_clock_entries_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "time_clock_entries" ADD CONSTRAINT "time_clock_entries_employee_profile_id_fkey" FOREIGN KEY ("employee_profile_id") REFERENCES "employee_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "time_clock_entries" ADD CONSTRAINT "time_clock_entries_adjustment_request_id_fkey" FOREIGN KEY ("adjustment_request_id") REFERENCES "time_adjustment_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "time_clock_reminders" ADD CONSTRAINT "time_clock_reminders_employee_profile_id_fkey" FOREIGN KEY ("employee_profile_id") REFERENCES "employee_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Garantia de imutabilidade: marcações não podem ser alteradas
CREATE FUNCTION "prevent_time_clock_entry_update"() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Marcações de ponto não podem ser alteradas. Use um pedido de ajuste.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "time_clock_entries_block_update"
    BEFORE UPDATE ON "time_clock_entries"
    FOR EACH ROW EXECUTE FUNCTION "prevent_time_clock_entry_update"();
