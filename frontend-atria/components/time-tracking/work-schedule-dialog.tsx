"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useWorkScheduleMutations } from "@/hooks/use-time-tracking-admin";
import { toast } from "@/lib/toast";
import { ApiError } from "@/services";
import type {
  IsoWeekday,
  WorkSchedule,
  WorkScheduleInput,
} from "@/services/time-tracking.service";

const WEEKDAYS: { weekday: IsoWeekday; label: string }[] = [
  { weekday: 1, label: "Segunda" },
  { weekday: 2, label: "Terça" },
  { weekday: 3, label: "Quarta" },
  { weekday: 4, label: "Quinta" },
  { weekday: 5, label: "Sexta" },
  { weekday: 6, label: "Sábado" },
  { weekday: 7, label: "Domingo" },
];

/** Jornada atual da empresa, usada como sugestão ao criar uma nova. */
const DEFAULT_TIMES = {
  start: "08:00",
  breakStart: "13:00",
  breakEnd: "14:00",
  end: "19:00",
};
const DEFAULT_WORKDAYS: IsoWeekday[] = [1, 2, 3, 4];
const DEFAULT_TOLERANCE_MINUTES = 15;

interface DayFormState {
  weekday: IsoWeekday;
  enabled: boolean;
  start: string;
  breakStart: string;
  breakEnd: string;
  end: string;
}

type TimeField = "start" | "breakStart" | "breakEnd" | "end";

const TIME_FIELDS: { field: TimeField; label: string }[] = [
  { field: "start", label: "Entrada" },
  { field: "breakStart", label: "Saída almoço" },
  { field: "breakEnd", label: "Volta almoço" },
  { field: "end", label: "Saída" },
];

interface WorkScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = criar nova jornada */
  workSchedule: WorkSchedule | null;
}

export function WorkScheduleDialog({
  open,
  onOpenChange,
  workSchedule,
}: WorkScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        {open && (
          <WorkScheduleForm
            key={workSchedule?.id ?? "new"}
            workSchedule={workSchedule}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface WorkScheduleFormProps {
  workSchedule: WorkSchedule | null;
  onClose: () => void;
}

/** Montado a cada abertura do diálogo, já com o estado inicial correto. */
function WorkScheduleForm({ workSchedule, onClose }: WorkScheduleFormProps) {
  const { create, update } = useWorkScheduleMutations();
  const [name, setName] = useState(workSchedule?.name ?? "");
  const [tolerance, setTolerance] = useState(
    workSchedule?.reminderToleranceMinutes ?? DEFAULT_TOLERANCE_MINUTES,
  );
  const [days, setDays] = useState<DayFormState[]>(() =>
    buildInitialDays(workSchedule),
  );
  const [error, setError] = useState<string | null>(null);

  const isEditing = workSchedule !== null;
  const isSaving = create.isPending || update.isPending;

  function updateDay(weekday: IsoWeekday, changes: Partial<DayFormState>) {
    setDays((current) =>
      current.map((day) =>
        day.weekday === weekday ? { ...day, ...changes } : day,
      ),
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const input = toWorkScheduleInput(name, tolerance, days);
    if (input.days.length === 0) {
      setError("Selecione pelo menos um dia de trabalho.");
      return;
    }

    try {
      if (isEditing) {
        await update.mutateAsync({ id: workSchedule.id, data: input });
        toast.success("Jornada atualizada");
      } else {
        await create.mutateAsync(input);
        toast.success("Jornada criada");
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível salvar.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-[var(--atria-primary)]">
          {isEditing ? "Editar jornada" : "Nova jornada"}
        </DialogTitle>
      </DialogHeader>

      <FieldGroup className="py-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <Field>
            <FieldLabel htmlFor="ws-name">Nome *</FieldLabel>
            <Input
              id="ws-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Seg a Qui 08h–19h"
              maxLength={100}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="ws-tolerance">
              Lembrete após (min)
            </FieldLabel>
            <Input
              id="ws-tolerance"
              type="number"
              min={0}
              max={120}
              value={tolerance}
              onChange={(event) => setTolerance(Number(event.target.value))}
              required
            />
          </Field>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-[var(--atria-primary)]/10 text-left text-xs uppercase tracking-wide text-[var(--atria-primary)]/55">
                <th className="px-2 py-2 font-medium">Dia</th>
                {TIME_FIELDS.map(({ field, label }) => (
                  <th key={field} className="px-2 py-2 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr
                  key={day.weekday}
                  className="border-b border-[var(--atria-primary)]/5"
                >
                  <td className="px-2 py-2">
                    <label className="flex items-center gap-2 font-medium text-[var(--atria-primary)]">
                      <Switch
                        checked={day.enabled}
                        onCheckedChange={(enabled) =>
                          updateDay(day.weekday, { enabled })
                        }
                      />
                      {labelOf(day.weekday)}
                    </label>
                  </td>
                  {TIME_FIELDS.map(({ field, label }) => (
                    <td key={field} className="px-2 py-2">
                      <Input
                        type="time"
                        aria-label={`${label} - ${labelOf(day.weekday)}`}
                        value={day[field]}
                        disabled={!day.enabled}
                        onChange={(event) =>
                          updateDay(day.weekday, {
                            [field]: event.target.value,
                          })
                        }
                        required={day.enabled}
                        className="h-9"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-[var(--atria-primary)] text-white"
        >
          {isSaving ? "Salvando..." : "Salvar jornada"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function labelOf(weekday: IsoWeekday): string {
  return WEEKDAYS.find((item) => item.weekday === weekday)?.label ?? "";
}

function buildInitialDays(workSchedule: WorkSchedule | null): DayFormState[] {
  return WEEKDAYS.map(({ weekday }) => {
    const savedDay = workSchedule?.days.find((day) => day.weekday === weekday);
    if (savedDay) {
      return {
        weekday,
        enabled: true,
        start: savedDay.start,
        breakStart: savedDay.breakStart,
        breakEnd: savedDay.breakEnd,
        end: savedDay.end,
      };
    }

    const isDefaultWorkday =
      workSchedule === null && DEFAULT_WORKDAYS.includes(weekday);
    return { weekday, enabled: isDefaultWorkday, ...DEFAULT_TIMES };
  });
}

function toWorkScheduleInput(
  name: string,
  tolerance: number,
  days: DayFormState[],
): WorkScheduleInput {
  return {
    name: name.trim(),
    reminderToleranceMinutes: tolerance,
    days: days
      .filter((day) => day.enabled)
      .map(({ weekday, start, breakStart, breakEnd, end }) => ({
        weekday,
        start,
        breakStart,
        breakEnd,
        end,
      })),
  };
}
