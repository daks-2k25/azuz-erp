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
import type { ReportMetaMetrics } from "@/services/types";
import { formatCurrency, formatNumber } from "@/lib/report-utils";

const PRIMARY = "#004949";
const ACCENT = "#E8C39E";

function formatDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

interface ReportPerformanceChartProps {
  data: ReportMetaMetrics["performanceChart"];
}

export function ReportPerformanceChart({ data }: ReportPerformanceChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatDate(point.date),
  }));

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${PRIMARY}15`} />
          <XAxis
            dataKey="label"
            stroke={`${PRIMARY}80`}
            fontSize={11}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="spend"
            orientation="left"
            stroke={PRIMARY}
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `R$${formatNumber(v)}`}
          />
          <YAxis
            yAxisId="reach"
            orientation="right"
            stroke={ACCENT}
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => formatNumber(v)}
          />
          <Tooltip
            formatter={(value, name) => {
              const num = typeof value === "number" ? value : Number(value);
              if (name === "Investimento") return formatCurrency(num);
              return formatNumber(num);
            }}
            contentStyle={{
              borderRadius: "12px",
              border: `1px solid ${PRIMARY}20`,
            }}
          />
          <Legend />
          <Bar
            yAxisId="spend"
            dataKey="spend"
            name="Investimento"
            fill={PRIMARY}
            radius={[4, 4, 0, 0]}
            barSize={16}
            opacity={0.85}
          />
          <Line
            yAxisId="reach"
            type="monotone"
            dataKey="reach"
            name="Alcance"
            stroke={ACCENT}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
