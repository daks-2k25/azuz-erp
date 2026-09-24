"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import {
  CHART_COLORS,
  formatCurrency,
  resolveCategoryColor,
} from "@/lib/financial-utils";

interface ExpenseDistributionChartProps {
  data: {
    categoryId: string;
    categoryName: string;
    amount: number;
    color: string;
  }[];
}

export function ExpenseDistributionChart({
  data,
}: ExpenseDistributionChartProps) {
  const chartData = data.map((item, index) => {
    const color =
      item.color && item.color !== "#004949"
        ? item.color
        : resolveCategoryColor(item.categoryName, CHART_COLORS[index % CHART_COLORS.length]);

    return {
      name: item.categoryName,
      value: item.amount,
      color,
    };
  });

  return (
    <Card className="overflow-hidden rounded-2xl border border-violet-100 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(139,92,246,0.4)]">
      <div className="mb-4">
        <h2 className="font-semibold text-[var(--atria-primary)]">
          Despesas por Categoria
        </h2>
        <p className="text-xs text-[var(--atria-primary)]/45">
          Distribuição colorida do período selecionado
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-[var(--atria-primary)]/40">
          Nenhuma despesa registrada neste mês
        </div>
      ) : (
        <>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={102}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  stroke="white"
                  strokeWidth={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    formatCurrency(
                      typeof value === "number" ? value : Number(value),
                    )
                  }
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {chartData.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm"
                style={{
                  borderColor: `${item.color}55`,
                  backgroundColor: `${item.color}18`,
                  color: item.color,
                }}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
