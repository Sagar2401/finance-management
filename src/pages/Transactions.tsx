
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TransactionList } from '@/components/TransactionList';
import { TransactionForm } from '@/components/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Plus, X, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/lib/utils';

export default function TransactionsPage() {
  const isMobile = useIsMobile();
  const { transactions, addTransaction, isLoading, getFinancialSummary } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const summary = getFinancialSummary();
  
  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Filter transactions based on search term
  const filteredTransactions = sortedTransactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddTransaction = (data: any) => {
    addTransaction(data);
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              Manage your income and expenses
            </p>
          </div>
          
          {isMobile ? (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Add Transaction</DrawerTitle>
                  <DrawerDescription>
                    Create a new transaction record.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4">
                  <TransactionForm onSubmit={handleAddTransaction} isSubmitting={isLoading} />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                  <DialogDescription>
                    Create a new transaction record.
                  </DialogDescription>
                </DialogHeader>
                <TransactionForm onSubmit={handleAddTransaction} isSubmitting={isLoading} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-card flex flex-col items-center justify-center animate-fade-in">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-income">{formatCurrency(summary.totalIncome)}</p>
          </div>
          <div className="p-4 border rounded-lg bg-card flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-expense">{formatCurrency(summary.totalExpenses)}</p>
          </div>
          <div className="p-4 border rounded-lg bg-card flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.balance)}</p>
          </div>
        </div>
        
        <div className="border rounded-lg bg-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="p-4 flex flex-col sm:flex-row items-center gap-4 border-b">
            <div className="relative flex-1 w-full">
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-1 top-1/2 transform -translate-y-1/2"
                disabled
              >
                <Filter className="h-4 w-4 text-muted-foreground" />
              </Button>
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="divide-y">
            <TransactionList 
              transactions={filteredTransactions} 
              isLoading={isLoading}
            />
            
            {!isLoading && filteredTransactions.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No transactions found.</p>
                {searchTerm && (
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
