"use client";

import { useMemo } from "react";
import { Bell, Sparkles } from "lucide-react";
import { useBranding } from "@/contexts/branding-context";
import { cn } from "@/lib/utils";

interface WelcomeHeaderProps {
  userName: string;
  notificationCount: number;
  onNotificationsClick?: () => void;
}

function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function formatTodayLabel(date = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function WelcomeHeader({
  userName,
  notificationCount,
  onNotificationsClick,
}: WelcomeHeaderProps) {
  const { branding } = useBranding();
  const firstName = userName.trim().split(/\s+/)[0] || userName;
  const greeting = useMemo(() => getGreeting(), []);
  const todayLabel = useMemo(() => formatTodayLabel(), []);
  const hasNotifications = notificationCount > 0;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[var(--atria-primary)]/10",
        "bg-[#004646]",
        "px-6 py-8 text-white shadow-xl shadow-[var(--atria-primary)]/15 sm:px-8 sm:py-10",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-[var(--atria-accent)]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white/80 uppercase backdrop-blur-sm">
            <Sparkles className="size-3.5 text-[var(--atria-accent)]" />
            {branding.agencyName || "ATRIA"}
          </div>

          <p className="text-sm font-medium text-white/55 capitalize">
            {todayLabel}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
            {greeting},{" "}
            <span className="text-[var(--atria-accent)]">{firstName}</span>
          </h1>

          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Bem-vindo de volta {firstName}!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onNotificationsClick}
            aria-label="Abrir notificações"
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left backdrop-blur-sm transition hover:bg-white/15"
          >
            <div className="flex items-center gap-3">
              <div className="relative rounded-xl bg-[var(--atria-accent)]/25 p-2.5 text-[var(--atria-accent)]">
                <Bell className="size-5" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--atria-accent)] ring-2 ring-[var(--atria-primary)]" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-white/50 uppercase">
                  Pendências
                </p>
                <p className="text-lg font-bold text-white">
                  {hasNotifications
                    ? `${notificationCount} aguardando`
                    : "Tudo em dia"}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
