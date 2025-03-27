import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactions } from "@/hooks/useTransactions";
import { formatNumber, formatCurrency } from "@/lib/utils";

export function IncomeExpenseChart() {
  const isMobile = useIsMobile();
  const { getMonthlyData } = useTransactions();

  // Get real data from transactions
  const data = getMonthlyData();

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `₹${formatNumber(value)}`;
    }
    return `₹${value}`;
  };

  const tooltipFormatter = (value: number, name: string) => {
    return [`${formatCurrency(value)}`, name];
  };
  return (
    <div className="h-[250px] w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: isMobile ? 0 : 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            fontSize={16}
            dataKey="name"
            axisLine={false}
            tick={{ fontSize: isMobile ? 8 : 10, fill: "#555" }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            width={isMobile ? 30 : 45}
            tick={{ fontSize: isMobile ? 8 : 10, fill: "#555" }}
          />
          <Tooltip
            formatter={tooltipFormatter}
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          />
          <Legend iconType="circle" />
          <Bar
            dataKey="income"
            name="Income"
            fill="hsl(var(--income))"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            barSize={isMobile ? 12 : 20}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="hsl(var(--expense))"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            barSize={isMobile ? 12 : 20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
