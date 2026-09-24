"use client";

import { ClockInCard } from "@/components/time-tracking/clock-in-card";
import { TodayEntriesCard } from "@/components/time-tracking/today-entries-card";
import { useMyEmployeeProfile, useTodayClock } from "@/hooks/use-time-clock";

export default function TimeClockPage() {
  const { data: profile, isLoading: isLoadingProfile } = useMyEmployeeProfile();
  const canClockIn = Boolean(profile?.isActive);
  const { data: today, isLoading: isLoadingToday } = useTodayClock(canClockIn);

  if (isLoadingProfile || (canClockIn && isLoadingToday)) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
          Ponto
        </h1>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Registre sua entrada, almoço e saída
        </p>
      </div>

      {!canClockIn || !today ? (
        <p className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6 text-center text-sm text-[var(--atria-primary)]/60">
          {profile
            ? "Seu cadastro de ponto está desativado. Fale com o administrador."
            : "Você não está cadastrado como funcionário CLT."}
        </p>
      ) : (
        <>
          <ClockInCard today={today} />
          <TodayEntriesCard today={today} />
        </>
      )}
    </div>
  );
}
