"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useWorkScheduleMutations,
  useWorkSchedules,
} from "@/hooks/use-time-tracking-admin";
import { formatMinutesAsHours } from "@/lib/time-tracking/format";
import { toast } from "@/lib/toast";
import { ApiError } from "@/services";
import type { WorkSchedule } from "@/services/time-tracking.service";
import { WorkScheduleDialog } from "./work-schedule-dialog";

export function WorkSchedulesPanel() {
  const { data: workSchedules = [], isLoading } = useWorkSchedules();
  const { setActive } = useWorkScheduleMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkSchedule | null>(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(workSchedule: WorkSchedule) {
    setEditing(workSchedule);
    setDialogOpen(true);
  }

  async function toggleActive(workSchedule: WorkSchedule) {
    try {
      await setActive.mutateAsync({
        id: workSchedule.id,
        isActive: !workSchedule.isActive,
      });
      toast.success(
        workSchedule.isActive ? "Jornada desativada" : "Jornada reativada",
      );
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Não foi possível alterar.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            Jornadas de trabalho
          </h2>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Horários esperados de cada dia. Usados no cálculo de horas e nos
            lembretes.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-[var(--atria-primary)] text-white"
          onClick={openCreate}
        >
          <Plus className="size-4" />
          Nova jornada
        </Button>
      </header>

      {isLoading ? (
        <LoadingSpinner />
      ) : workSchedules.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--atria-primary)]/50">
          Nenhuma jornada cadastrada. Crie a primeira para cadastrar
          funcionários CLT.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {workSchedules.map((workSchedule) => (
            <li
              key={workSchedule.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[var(--atria-primary)]/10 p-4"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--atria-primary)]">
                    {workSchedule.name}
                  </span>
                  <Badge variant={workSchedule.isActive ? "success" : "outline"}>
                    {workSchedule.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--atria-primary)]/60">
                  {formatMinutesAsHours(workSchedule.weeklyWorkMinutes)} por
                  semana · lembrete após {workSchedule.reminderToleranceMinutes}{" "}
                  min
                </p>
                <ul className="mt-1 text-sm text-[var(--atria-primary)]/70">
                  {workSchedule.days.map((day) => (
                    <li key={day.weekday}>
                      <span className="inline-block w-28 font-medium">
                        {day.weekdayLabel}
                      </span>
                      {day.start}–{day.breakStart} · {day.breakEnd}–{day.end}{" "}
                      <span className="text-[var(--atria-primary)]/45">
                        ({formatMinutesAsHours(day.workMinutes)})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(workSchedule)}
                >
                  <Pencil className="size-4" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={setActive.isPending}
                  onClick={() => void toggleActive(workSchedule)}
                >
                  {workSchedule.isActive ? "Desativar" : "Reativar"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <WorkScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        workSchedule={editing}
      />
    </section>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[120px] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
    </div>
  );
}
