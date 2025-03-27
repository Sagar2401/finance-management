
import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  isLoading?: boolean;
}

export function TransactionList({ transactions, limit, isLoading: globalLoading = false }: TransactionListProps) {
  const { deleteTransaction } = useTransactions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const limitedTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteTransaction(id);
    setDeletingId(null);
  };
  
  if (globalLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {limitedTransactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className="flex justify-between items-center p-4 animate-fade-in hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <p className="font-medium truncate pr-4">
                {transaction.description || 
                  (transaction.type === 'income' ? 'Income' : 'Expense')}
              </p>
              <p className={transaction.type === 'income' ? 'text-income font-medium' : 'text-expense font-medium'}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <p className="capitalize">{transaction.category.replace('-', ' ')}</p>
              <p>{transaction.date.toLocaleDateString()}</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 text-muted-foreground hover:text-foreground"
                disabled={!!deletingId}
              >
                {deletingId === transaction.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this transaction? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDelete(transaction.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
