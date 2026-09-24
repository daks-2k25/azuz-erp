"use client";

import { History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  formatContentDate,
  LIQUID_GLASS_CLASS,
} from "@/lib/content-utils";
import { resolveMediaUrl } from "@/lib/media-url";
import type { PostFeedback, PostVersion } from "@/services/types";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface VersionHistoryDrawerProps {
  versions: PostVersion[];
  feedback: PostFeedback[];
  selectedVersionId?: string | null;
  onSelectVersion: (version: PostVersion) => void;
}

export function VersionHistoryDrawer({
  versions,
  feedback,
  selectedVersionId,
  onSelectVersion,
}: VersionHistoryDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" className="gap-2">
            <History className="size-4" />
            Histórico de Versões
          </Button>
        }
      />

      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-white/20 bg-white/80 backdrop-blur-xl sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="text-[var(--atria-primary)]">
            Histórico de Versões
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--atria-primary)]/50">
              Versões
            </h3>
            {versions.length === 0 ? (
              <p className="text-sm text-[var(--atria-primary)]/50">
                Nenhuma versão salva ainda.
              </p>
            ) : (
              versions.map((version) => (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => onSelectVersion(version)}
                  className={cn(
                    LIQUID_GLASS_CLASS,
                    "w-full p-4 text-left transition-all hover:border-[var(--atria-accent)]/40",
                    selectedVersionId === version.id &&
                      "border-[var(--atria-accent)]/50 ring-2 ring-[var(--atria-accent)]/20",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[var(--atria-primary)]">
                      {version.versionLabel}
                    </span>
                    <span className="text-[10px] text-[var(--atria-primary)]/40">
                      {formatContentDate(version.createdAt)}
                    </span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs text-[var(--atria-primary)]/60">
                    {version.copyText}
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6 border border-[var(--atria-accent)]/30">
                      {version.createdBy.avatarUrl && (
                        <AvatarImage src={resolveMediaUrl(version.createdBy.avatarUrl) ?? undefined} />
                      )}
                      <AvatarFallback className="bg-[var(--atria-accent)]/30 text-[8px] text-[var(--atria-primary)]">
                        {getInitials(version.createdBy.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-[var(--atria-primary)]/70">
                      {version.createdBy.name}
                    </span>
                  </div>
                </button>
              ))
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--atria-primary)]/50">
              Feedback & Rejeições
            </h3>
            {feedback.length === 0 ? (
              <p className="text-sm text-[var(--atria-primary)]/50">
                Nenhum feedback registrado.
              </p>
            ) : (
              feedback.map((entry) => (
                <div
                  key={entry.id}
                  className={cn(
                    LIQUID_GLASS_CLASS,
                    "p-4",
                    entry.type === "rejection_reason" &&
                      "border-red-200/60 bg-red-50/40",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        entry.type === "rejection_reason"
                          ? "bg-red-100 text-red-700"
                          : "bg-[var(--atria-primary)]/10 text-[var(--atria-primary)]",
                      )}
                    >
                      {entry.type === "rejection_reason"
                        ? "Motivo de Rejeição"
                        : "Nota Geral"}
                    </span>
                    {entry.versionLabel && (
                      <span className="text-[10px] text-[var(--atria-primary)]/40">
                        {entry.versionLabel}
                      </span>
                    )}
                  </div>
                  <p className="mb-3 text-sm text-[var(--atria-primary)]">
                    {entry.comment}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6 border border-[var(--atria-accent)]/30">
                        {entry.user.avatarUrl && (
                          <AvatarImage src={resolveMediaUrl(entry.user.avatarUrl) ?? undefined} />
                        )}
                        <AvatarFallback className="bg-[var(--atria-accent)]/30 text-[8px] text-[var(--atria-primary)]">
                          {getInitials(entry.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-[var(--atria-primary)]/70">
                        {entry.user.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--atria-primary)]/40">
                      {formatContentDate(entry.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
