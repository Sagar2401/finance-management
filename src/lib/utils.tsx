import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TransactionCategory, TransactionType } from "@/types";
import React from "react";
import {
  ShoppingBag,
  Utensils,
  Home,
  Car,
  Lightbulb,
  HeartPulse,
  GraduationCap,
  Shirt,
  User,
  MoreHorizontal,
  DollarSign,
  Briefcase,
  Gift,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function getCategoryIcon(
  category: TransactionCategory
): React.ReactNode {
  const iconProps = { className: "h-3 w-3 mr-1" };

  switch (category) {
    // Income categories
    case "salary":
      return <Briefcase {...iconProps} />;
    case "investment":
      return <DollarSign {...iconProps} />;
    case "gift":
      return <Gift {...iconProps} />;

    // Expense categories
    case "food":
      return <Utensils {...iconProps} />;
    case "housing":
      return <Home {...iconProps} />;
    case "transportation":
      return <Car {...iconProps} />;
    case "utilities":
      return <Lightbulb {...iconProps} />;
    case "healthcare":
      return <HeartPulse {...iconProps} />;
    case "entertainment":
      return <ShoppingBag {...iconProps} />;
    case "education":
      return <GraduationCap {...iconProps} />;
    case "shopping":
      return <Shirt {...iconProps} />;
    case "personal":
      return <User {...iconProps} />;

    default:
      return <MoreHorizontal {...iconProps} />;
  }
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    salary: "Salary",
    investment: "Investment",
    gift: "Gift",
    "other-income": "Other Income",
    food: "Food",
    housing: "Housing",
    transportation: "Transportation",
    utilities: "Utilities",
    healthcare: "Healthcare",
    entertainment: "Entertainment",
    education: "Education",
    shopping: "Shopping",
    personal: "Personal",
    "other-expense": "Other Expense",
  };

  return labels[category] || category;
}

export const TRANSACTION_CATEGORIES = [
  // Income categories
  {
    type: "income" as TransactionType,
    value: "salary",
    label: "Salary",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    type: "income" as TransactionType,
    value: "investment",
    label: "Investment",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    type: "income" as TransactionType,
    value: "gift",
    label: "Gift",
    icon: <Gift className="h-4 w-4" />,
  },
  {
    type: "income" as TransactionType,
    value: "other-income",
    label: "Other Income",
    icon: <MoreHorizontal className="h-4 w-4" />,
  },

  // Expense categories
  {
    type: "expense" as TransactionType,
    value: "food",
    label: "Food",
    icon: <Utensils className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "housing",
    label: "Housing",
    icon: <Home className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "transportation",
    label: "Transportation",
    icon: <Car className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "utilities",
    label: "Utilities",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "healthcare",
    label: "Healthcare",
    icon: <HeartPulse className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "entertainment",
    label: "Entertainment",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "education",
    label: "Education",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "shopping",
    label: "Shopping",
    icon: <Shirt className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "personal",
    label: "Personal",
    icon: <User className="h-4 w-4" />,
  },
  {
    type: "expense" as TransactionType,
    value: "other-expense",
    label: "Other Expense",
    icon: <MoreHorizontal className="h-4 w-4" />,
  },
];
