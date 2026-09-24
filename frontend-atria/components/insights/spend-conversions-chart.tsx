"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { MetaPerformancePoint } from "@/services/types";
import { INSIGHTS_ACCENT, INSIGHTS_PRIMARY } from "./insights-metrics";

function formatDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

interface SpendConversionsChartProps {
  data: MetaPerformancePoint[];
}

export function SpendConversionsChart({ data }: SpendConversionsChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatDate(point.date),
  }));

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-6">
      <h2
        className="mb-4 font-semibold"
        style={{ color: INSIGHTS_PRIMARY }}
      >
        Investimento vs. Conversões
      </h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${INSIGHTS_PRIMARY}15`} />
            <XAxis
              dataKey="label"
              stroke={`${INSIGHTS_PRIMARY}80`}
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              yAxisId="spend"
              orientation="left"
              stroke={INSIGHTS_PRIMARY}
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <YAxis
              yAxisId="conversions"
              orientation="right"
              stroke={INSIGHTS_ACCENT}
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => {
                const num = typeof value === "number" ? value : Number(value);
                return name === "Investimento (R$)"
                  ? formatCurrency(num)
                  : num;
              }}
              contentStyle={{
                borderRadius: "12px",
                border: `1px solid ${INSIGHTS_PRIMARY}20`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            />
            <Legend />
            <Bar
              yAxisId="spend"
              dataKey="spend"
              name="Investimento (R$)"
              fill={INSIGHTS_PRIMARY}
              radius={[4, 4, 0, 0]}
              barSize={24}
              opacity={0.85}
            />
            <Line
              yAxisId="conversions"
              type="monotone"
              dataKey="conversions"
              name="Conversões"
              stroke={INSIGHTS_ACCENT}
              strokeWidth={3}
              dot={{ fill: INSIGHTS_ACCENT, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: INSIGHTS_PRIMARY }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
