"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  FINANCE_COLORS,
  formatChartMonth,
  formatCompactCurrency,
  formatCurrency,
  formatMonthKey,
  type FinancePeriod,
} from "@/lib/financial-utils";

interface CashFlowChartProps {
  data: { month: string; income: number; expense: number }[];
  period: FinancePeriod;
}

export function CashFlowChart({ data, period }: CashFlowChartProps) {
  const activeMonthKey = formatMonthKey(period);

  const chartData = data.map((item) => ({
    ...item,
    label: formatChartMonth(item.month),
    isActive: item.month === activeMonthKey,
  }));

  const hasData = chartData.some(
    (item) => item.income > 0 || item.expense > 0,
  );

  return (
    <Card className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(16,185,129,0.45)]">
      <div className="mb-4">
        <h2 className="font-semibold text-[var(--atria-primary)]">
          Fluxo de Caixa Mensal
        </h2>
        <p className="text-xs text-[var(--atria-primary)]/45">
          Receitas e despesas por mês em {period.year}
        </p>
      </div>

      {!hasData ? (
        <div className="flex h-72 items-center justify-center text-sm text-[var(--atria-primary)]/40">
          Nenhum movimento registrado neste ano
        </div>
      ) : (
        <>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="label"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => formatCompactCurrency(value)}
                />
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
                <Legend />
                <Bar
                  dataKey="income"
                  name="Receita"
                  fill={FINANCE_COLORS.income.primary}
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="expense"
                  name="Despesa"
                  fill={FINANCE_COLORS.expense.primary}
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm"
              style={{
                borderColor: `${FINANCE_COLORS.income.primary}55`,
                backgroundColor: `${FINANCE_COLORS.income.primary}18`,
                color: FINANCE_COLORS.income.dark,
              }}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: FINANCE_COLORS.income.primary }}
              />
              Receitas
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm"
              style={{
                borderColor: `${FINANCE_COLORS.expense.primary}55`,
                backgroundColor: `${FINANCE_COLORS.expense.primary}18`,
                color: FINANCE_COLORS.expense.dark,
              }}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: FINANCE_COLORS.expense.primary }}
              />
              Despesas
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
