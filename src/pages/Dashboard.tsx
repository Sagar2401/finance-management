
import React from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard as DashboardComponent } from '@/components/Dashboard';
import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';

export default function DashboardPage() {
  const { transactions, getFinancialSummary } = useTransactions();
  const { goals } = useGoals();
  
  // Get recent transactions in descending order by date
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your financial activity
          </p>
        </div>
        
        <DashboardComponent 
          summary={getFinancialSummary()} 
          recentTransactions={recentTransactions}
          goals={goals}
        />
      </div>
    </Layout>
  );
}
