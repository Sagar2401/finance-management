import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--income))",
  "hsl(var(--expense))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
];

export function CategoryChart() {
  const [chartType, setChartType] = useState<"expense" | "income">("expense");
  const { getCategoryData } = useTransactions();

  const data = getCategoryData(chartType);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
        <p>No {chartType} data for this month</p>
      </div>
    );
  }

  const renderLabel = (entry: any) => {
    if (entry.percentage < 5) return null;
    return `${entry.category}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="font-medium capitalize">{data.category}</p>
          <p className="text-primary">{formatCurrency(data.amount)}</p>
          <p className="text-muted-foreground text-xs">
            {data.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        <button
          className={`px-3 py-1 rounded-full text-xs ${
            chartType === "expense"
              ? "bg-expense/15 text-expense font-medium"
              : "text-muted-foreground"
          }`}
          onClick={() => setChartType("expense")}
        >
          Expenses
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs ${
            chartType === "income"
              ? "bg-income/15 text-income font-medium"
              : "text-muted-foreground"
          }`}
          onClick={() => setChartType("income")}
        >
          Income
        </button>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => <span className="capitalize">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
