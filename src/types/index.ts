
export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'salary' 
  | 'investment' 
  | 'gift' 
  | 'other-income'
  | 'food' 
  | 'housing' 
  | 'transportation' 
  | 'utilities' 
  | 'healthcare' 
  | 'entertainment' 
  | 'education' 
  | 'shopping' 
  | 'personal' 
  | 'other-expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: Date;
}

export interface GoalStatus {
  target: number;
  current: number;
  percentage: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string; // Changed from optional to required with empty string as default
  target: number;
  current: number;
  deadline?: Date;
  color?: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  trends: {
    income: number;
    expenses: number;
    balance: number;
    savingsRate: number;
  };
}

export interface CategorySummary {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}
