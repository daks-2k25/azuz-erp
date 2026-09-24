"use client";

import { CheckCircle2, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useRegisterClockEntry,
  type TodayClockView,
} from "@/hooks/use-time-clock";
import { formatCalendarDate } from "@/lib/time-tracking/format";
import { toast } from "@/lib/toast";
import { ApiError } from "@/services";
import { LiveClock } from "./live-clock";

interface ClockInCardProps {
  today: TodayClockView;
}

export function ClockInCard({ today }: ClockInCardProps) {
  const registerEntry = useRegisterClockEntry();
  const isDayComplete = today.nextEntry === null;

  async function handleRegister() {
    try {
      const { entry } = await registerEntry.mutateAsync();
      toast.success(`${entry.label} registrada às ${entry.time}`, {
        description: `Comprovante: NSR ${entry.sequenceNumber}`,
      });
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Não foi possível registrar o ponto.",
      );
    }
  }

  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6 text-center">
      <div>
        <p className="text-sm font-medium text-[var(--atria-primary)]/60">
          {today.weekdayLabel}, {formatCalendarDate(today.date)}
        </p>
        <LiveClock
          serverOffsetMs={today.serverOffsetMs}
          className="block text-5xl font-bold tabular-nums text-[var(--atria-primary)]"
        />
        <p className="mt-1 text-xs text-[var(--atria-primary)]/45">
          Horário de Brasília (servidor)
        </p>
      </div>

      {!today.isWorkday && (
        <p className="rounded-lg bg-[var(--atria-accent)]/30 px-3 py-2 text-sm text-[var(--atria-primary)]">
          Hoje não é dia de jornada. As marcações de hoje contam como hora
          extra.
        </p>
      )}

      {isDayComplete ? (
        <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 font-medium text-green-700">
          <CheckCircle2 className="size-5" />
          Todas as marcações de hoje foram registradas
        </p>
      ) : (
        <Button
          size="lg"
          onClick={() => void handleRegister()}
          disabled={registerEntry.isPending}
          className="h-14 w-full max-w-sm bg-[var(--atria-primary)] text-lg text-white"
        >
          <Fingerprint className="size-6" />
          {registerEntry.isPending
            ? "Registrando..."
            : `Registrar ${today.nextEntry?.label.toLowerCase()}`}
        </Button>
      )}
    </section>
  );
}
