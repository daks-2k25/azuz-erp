"use client";

import { forwardRef } from "react";
import { ReportPerformanceChart } from "@/components/reports/report-performance-chart";
import {
  FORMAT_LABELS,
  PLATFORM_LABELS,
  formatCurrency,
  formatNumber,
  formatReportPeriod,
} from "@/lib/report-utils";
import type { ClientReport } from "@/services/types";
import { cn } from "@/lib/utils";

interface ReportExportViewProps {
  report: ClientReport;
  className?: string;
}

export const ReportExportView = forwardRef<HTMLDivElement, ReportExportViewProps>(
  function ReportExportView({ report, className }, ref) {
    const { data } = report;
    const { summary, content, meta, projects } = data;

    return (
      <div
        ref={ref}
        className={cn("report-export w-full min-w-0 bg-white text-[#1a1a1a]", className)}
      >
        <header className="bg-[#004949] px-8 py-10 text-white">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-[#E8C39E]">
                Relatório Executivo de Performance
              </p>
              <h1 className="mt-2 text-3xl font-bold">{data.client.companyName}</h1>
              <p className="mt-1 text-white/70">
                {formatReportPeriod(report.month, report.year)}
              </p>
            </div>
            <div className="rounded-xl border border-[#E8C39E]/30 bg-[#E8C39E]/10 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-wide text-[#E8C39E]">
                Gerado em
              </p>
              <p className="text-sm font-medium">
                {new Date(report.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 px-8 py-8 md:grid-cols-4">
          {[
            { label: "Posts Publicados", value: summary.totalPostsPublished },
            { label: "Alcance Meta", value: formatNumber(summary.metaReach) },
            { label: "Investimento", value: formatCurrency(summary.metaSpend) },
            {
              label: "Engajamento",
              value: formatNumber(summary.metaEngagement),
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#004949]/10 bg-[#F8F8F6] p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-[#004949]/50">
                {kpi.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-[#004949]">
                {kpi.value}
              </p>
            </div>
          ))}
        </section>

        <section className="px-8 pb-8">
          <h2 className="mb-4 text-lg font-semibold text-[#004949]">
            Performance Meta Ads
          </h2>
          <div className="rounded-xl border border-[#004949]/10 p-4">
            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "ROAS", value: `${meta.roas}x` },
                { label: "Taxa de Engajamento", value: `${meta.engagementRate}%` },
                { label: "Conversões", value: formatNumber(meta.conversions) },
                { label: "Campanhas Ativas", value: meta.activeCampaigns },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-[#004949]/50">{item.label}</p>
                  <p className="font-semibold text-[#004949]">{item.value}</p>
                </div>
              ))}
            </div>
            <ReportPerformanceChart data={meta.performanceChart} />
          </div>
        </section>

        <section className="grid gap-8 px-8 pb-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#004949]">
              Conteúdo Publicado
            </h2>
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(content.byPlatform).map(([platform, count]) => (
                <span
                  key={platform}
                  className="rounded-full bg-[#E8C39E]/30 px-3 py-1 text-xs font-medium text-[#004949]"
                >
                  {PLATFORM_LABELS[platform] ?? platform}: {count}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {content.completedPosts.length === 0 ? (
                <p className="text-sm text-[#004949]/50">
                  Nenhum post publicado neste período.
                </p>
              ) : (
                content.completedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border border-[#004949]/10 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[#004949]">{post.title}</p>
                      <span className="text-xs text-[#004949]/50">
                        {PLATFORM_LABELS[post.platform] ?? post.platform}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#004949]/60">
                      {FORMAT_LABELS[post.format] ?? post.format}
                      {post.scheduledDate &&
                        ` · ${new Date(post.scheduledDate).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#004949]">
              Projetos Ativos
            </h2>
            {projects.activeContracts.length === 0 ? (
              <p className="text-sm text-[#004949]/50">
                Nenhum contrato ativo no período.
              </p>
            ) : (
              <div className="space-y-3">
                {projects.activeContracts.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-[#004949]/10 p-3"
                  >
                    <p className="font-medium text-[#004949]">{project.title}</p>
                    <p className="mt-1 text-sm text-[#004949]/60">
                      {formatCurrency(project.recurringValue)} ·{" "}
                      {project.paymentFrequency === "monthly"
                        ? "Mensal"
                        : "Único"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="border-t border-[#004949]/10 bg-[#F8F8F6] px-8 py-4 text-center text-xs text-[#004949]/40">
          ATRIA · Relatório confidencial · {data.client.companyName}
        </footer>
      </div>
    );
  },
);
