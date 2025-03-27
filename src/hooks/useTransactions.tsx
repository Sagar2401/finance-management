import { useState, useEffect } from "react";
import {
  Transaction,
  TransactionType,
  TransactionCategory,
  CategorySummary,
  FinancialSummary,
} from "@/types";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries";
import { ADD_TRANSACTION, DELETE_TRANSACTION } from "@/lib/graphql/mutations";
import { supabase } from "@/integrations/supabase/client";
import { formatNumber } from "@/lib/utils";

interface TransactionFormData {
  amount: string;
  category: string;
  date: Date;
  description?: string;
  type: "income" | "expense";
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // GraphQL query for transactions
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS, {
    fetchPolicy: "network-only",
  });

  // GraphQL mutations
  const [addTransactionMutation] = useMutation(ADD_TRANSACTION);
  const [deleteTransactionMutation] = useMutation(DELETE_TRANSACTION);

  // Update transactions when GraphQL data changes
  useEffect(() => {
    if (data && data.transactionsCollection) {
      const formattedTransactions: Transaction[] =
        data.transactionsCollection.edges.map((edge: any) => ({
          id: edge.node.id,
          amount: parseFloat(edge.node.amount),
          category: edge.node.category,
          date: new Date(edge.node.date),
          description: edge.node.description || "",
          type: edge.node.type,
        }));
      setTransactions(formattedTransactions);
    }
  }, [data]);

  // Initial loading state from GraphQL
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Handle GraphQL errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    }
  }, [error]);

  const addTransaction = async (data: TransactionFormData) => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Parse the amount to a number for the API
      const newTransaction = {
        user_id: user.id,
        amount: data.amount.toString(), // Convert string to number
        category: data.category,
        date: data.date.toISOString(),
        description: data.description || "",
        type: data.type,
      };

      console.log("Sending transaction to GraphQL:", newTransaction);

      const { data: result, errors } = await addTransactionMutation({
        variables: {
          transaction: newTransaction,
        },
      });

      if (errors) {
        throw errors;
      }

      // Get the inserted transaction
      const insertedTransaction =
        result.insertIntotransactionsCollection.records[0];

      // Add the new transaction to our local state
      const formattedTransaction: Transaction = {
        id: insertedTransaction.id,
        amount: parseFloat(insertedTransaction.amount),
        category: insertedTransaction.category,
        date: new Date(insertedTransaction.date),
        description: insertedTransaction.description || "",
        type: insertedTransaction.type,
      };

      setTransactions((prev) => [...prev, formattedTransaction]);

      toast({
        title: "Transaction created",
        description: `Successfully added new ${data.type}.`,
      });

      return formattedTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setIsLoading(true);

    try {
      const { data: result, errors } = await deleteTransactionMutation({
        variables: { id },
      });

      if (errors) {
        throw errors;
      }

      // Remove the transaction from our local state
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );

      toast({
        title: "Transaction deleted",
        description: "Successfully deleted transaction.",
      });

      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getFinancialSummary = (): FinancialSummary => {
    // Get current date parameters
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter transactions for current month and last month
    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const lastMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });

    // Calculate current month totals
    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

    // Calculate last month totals
    const lastMonthIncome = lastMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthBalance = lastMonthIncome - lastMonthExpenses;
    const lastMonthSavingsRate =
      lastMonthIncome > 0
        ? Math.round((lastMonthBalance / lastMonthIncome) * 100)
        : 0;

    // Calculate trends (percentage change from last month)
    // Avoid division by zero
    const incomeTrend =
      lastMonthIncome === 0
        ? totalIncome > 0
          ? 100
          : 0
        : Math.round(((totalIncome - lastMonthIncome) / lastMonthIncome) * 100);

    const expensesTrend =
      lastMonthExpenses === 0
        ? totalExpenses > 0
          ? 100
          : 0
        : Math.round(
            ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
          );

    const balanceTrend =
      lastMonthBalance === 0
        ? balance > 0
          ? 100
          : balance < 0
          ? -100
          : 0
        : Math.round(
            ((balance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100
          );

    const savingsRateTrend =
      lastMonthSavingsRate === 0
        ? savingsRate > 0
          ? 100
          : 0
        : savingsRate - lastMonthSavingsRate;

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      trends: {
        income: incomeTrend,
        expenses: expensesTrend,
        balance: balanceTrend,
        savingsRate: savingsRateTrend,
      },
    };
  };

  const getCategoryData = (type: TransactionType): CategorySummary[] => {
    // Filter to current month transactions only
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        t.type === type
      );
    });

    const total = currentMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const categoryMap = new Map<TransactionCategory, number>();

    for (const transaction of currentMonthTransactions) {
      const current = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, current + transaction.amount);
    }

    const result: CategorySummary[] = [];

    for (const [category, amount] of categoryMap.entries()) {
      result.push({
        category,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      });
    }

    return result.sort((a, b) => b.amount - a.amount);
  };

  const getMonthlyData = () => {
    // Create a map to store monthly data
    const monthlyData: Record<string, { income: number; expenses: number }> =
      {};

    // Get last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = d.toLocaleDateString("en-US", { month: "short" });
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    // Fill with transaction data
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);

      // Only consider transactions from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      if (date >= sixMonthsAgo) {
        const monthKey = date.toLocaleDateString("en-US", { month: "short" });

        if (monthlyData[monthKey]) {
          if (transaction.type === "income") {
            monthlyData[monthKey].income += transaction.amount;
          } else {
            monthlyData[monthKey].expenses += transaction.amount;
          }
        }
      }
    });

    // Convert to array for chart library
    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      income: Math.round(data.income),
      expenses: Math.round(data.expenses),
    }));
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    deleteTransaction,
    getFinancialSummary,
    getMonthlyData,
    getCategoryData,
  };
}
