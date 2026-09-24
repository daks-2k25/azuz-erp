"use client";

import Link from "next/link";
import { ContentStatusBadge } from "@/components/content/content-status-badge";
import { LiquidGlassCard } from "@/components/creation/liquid-glass-card";
import type { Client360Pipeline } from "@/services/types";

const FORMAT_LABELS = {
  carousel: "Carrossel",
  reels: "Reels",
  static: "Estático",
  story: "Story",
};

interface ClientPipelineTabProps {
  data: Client360Pipeline;
  clientId: string;
}

export function ClientPipelineTab({ data, clientId }: ClientPipelineTabProps) {
  const { overview } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Rascunhos", value: overview.drafts },
          { label: "Em aprovação", value: overview.pendingApproval },
          { label: "Aprovados", value: overview.approved },
          { label: "Agendados", value: overview.scheduled },
          { label: "Publicados", value: overview.published },
          { label: "Rejeitados", value: overview.rejected },
        ].map((stat) => (
          <LiquidGlassCard key={stat.label} className="!p-4 text-center">
            <p className="text-2xl font-bold text-[var(--atria-primary)]">
              {stat.value}
            </p>
            <p className="text-[11px] text-[var(--atria-primary)]/50">
              {stat.label}
            </p>
          </LiquidGlassCard>
        ))}
      </div>

      <LiquidGlassCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            Posts ativos
          </h2>
          <Link
            href={`/kanban?clientId=${clientId}`}
            className="text-xs font-medium text-[var(--atria-primary)]/60 hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.posts.length === 0 ? (
            <p className="col-span-full text-sm text-[var(--atria-primary)]/50">
              Nenhum post para este cliente.
            </p>
          ) : (
            data.posts.map((post) => (
              <Link
                key={post.id}
                href={`/content/${post.id}`}
                className="group overflow-hidden rounded-xl border border-white/40 bg-white/50 transition-colors hover:bg-white/80"
              >
                <div
                  className="flex h-24 items-center justify-center"
                  style={{ backgroundColor: `${post.platformColor}15` }}
                >
                  {post.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.previewUrl}
                      alt={post.title}
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  ) : (
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: post.platformColor }}
                    >
                      {FORMAT_LABELS[post.format]}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-[var(--atria-primary)] group-hover:underline">
                    {post.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[var(--atria-primary)]/50">
                      {FORMAT_LABELS[post.format]}
                    </span>
                    <ContentStatusBadge status={post.status} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </LiquidGlassCard>

      <LiquidGlassCard>
        <h2 className="mb-4 text-lg font-semibold text-[var(--atria-primary)]">
          Histórico de versões
        </h2>
        <div className="flex flex-col gap-2">
          {data.versionHistory.length === 0 ? (
            <p className="text-sm text-[var(--atria-primary)]/50">
              Nenhuma versão registrada ainda.
            </p>
          ) : (
            data.versionHistory.map((version) => (
              <Link
                key={version.id}
                href={`/content/${version.postId}`}
                className="rounded-xl border border-white/40 bg-white/50 px-4 py-3 transition-colors hover:bg-white/80"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--atria-primary)]">
                    {version.postTitle}
                  </p>
                  <span className="text-[10px] font-bold text-[var(--atria-primary)]/40">
                    v{version.versionNumber}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--atria-primary)]/60">
                  {version.copyPreview}
                </p>
                <p className="mt-1 text-[10px] text-[var(--atria-primary)]/40">
                  {version.createdBy.name} ·{" "}
                  {new Date(version.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </Link>
            ))
          )}
        </div>
      </LiquidGlassCard>
    </div>
  );
}
