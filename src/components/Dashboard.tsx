import React from "react";
import { StatCard } from "./ui/StatCard";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { IncomeExpenseChart } from "./charts/IncomeExpenseChart";
import { CategoryChart } from "./charts/CategoryChart";
import { TransactionList } from "./TransactionList";
import { GoalCard } from "./GoalCard";
import { FinancialSummary, Goal, Transaction } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardProps {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  goals: Goal[];
}

export function Dashboard({
  summary,
  recentTransactions,
  goals,
}: DashboardProps) {
  // Calculate goal totals
  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalGoalPercentage =
    totalGoalAmount > 0
      ? Math.round((totalCurrentAmount / totalGoalAmount) * 100)
      : 0;

  // Filter completed goals
  const completedGoals = goals.filter((goal) => goal.current >= goal.target);
  const completionRate =
    goals.length > 0
      ? Math.round((completedGoals.length / goals.length) * 100)
      : 0;

  // Limit goals to 3 for dashboard display
  const displayGoals = goals.slice(0, 2);
  const hasMoreGoals = goals.length > 2;

  // Limit transactions to 5
  const displayTransactions = recentTransactions.slice(0, 5);
  const hasMoreTransactions = recentTransactions.length > 5;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={<DollarSign className="h-4 w-4" />}
          description="Monthly income"
          trend={summary.trends.income}
          trendLabel="from last month"
          valueClassName="text-income"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={<TrendingDown className="h-4 w-4" />}
          description="Monthly expenses"
          trend={summary.trends.expenses}
          trendLabel="from last month"
          valueClassName="text-expense"
        />
        <StatCard
          title="Current Balance"
          value={formatCurrency(summary.balance)}
          icon={<DollarSign className="h-4 w-4" />}
          description="Available funds"
          trend={summary.trends.balance}
          trendLabel="from last month"
        />
        <StatCard
          title="Savings Rate"
          value={`${summary.savingsRate}%`}
          icon={<PiggyBank className="h-4 w-4" />}
          description="Of total income"
          trend={summary.trends.savingsRate}
          trendLabel="from last month"
          valueClassName="text-primary"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart />
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card
          className="md:col-span-2 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your last {displayTransactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={displayTransactions} />
          </CardContent>
          {hasMoreTransactions && (
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link
                  to="/transactions"
                  className="flex items-center justify-center"
                >
                  View All Transactions
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>Your active goals</CardDescription>
            </div>
            {goals.length > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium">
                  {completedGoals.length}/{goals.length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">{totalGoalPercentage}%</span>
                  </div>
                  <Progress value={totalGoalPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(totalCurrentAmount)}</span>
                    <span>of {formatCurrency(totalGoalAmount)}</span>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {displayGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>

                {hasMoreGoals && (
                  <Button variant="ghost" className="w-full mt-2" asChild>
                    <Link
                      to="/goals"
                      className="flex items-center justify-center"
                    >
                      View All Goals
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No savings goals created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
