
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { GoalCard } from '@/components/GoalCard';
import { GoalForm } from '@/components/GoalForm';
import { useGoals } from '@/hooks/useGoals';
import { Button } from '@/components/ui/button';
import { Loader2, PlusIcon } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/lib/utils';

export default function GoalsPage() {
  const isMobile = useIsMobile();
  const { goals, addGoal, isLoading } = useGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Calculate totals
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalPercentage = totalTarget > 0 
    ? Math.round((totalCurrent / totalTarget) * 100) 
    : 0;
  
  // Filter complete and incomplete goals
  const completedGoals = goals.filter(goal => goal.current >= goal.target);
  const incompleteGoals = goals.filter(goal => goal.current < goal.target);
  
  const handleAddGoal = (data: any) => {
    addGoal(data);
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
  };

  if (isLoading && goals.length === 0) {
    return (
      <Layout>
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
            <p className="text-muted-foreground">
              Track your progress towards financial targets
            </p>
          </div>
          
          {isMobile ? (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Add Goal</DrawerTitle>
                  <DrawerDescription>
                    Create a new savings goal.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4">
                  <GoalForm onSubmit={handleAddGoal} isSubmitting={isLoading} />
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
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Goal</DialogTitle>
                  <DialogDescription>
                    Create a new savings goal.
                  </DialogDescription>
                </DialogHeader>
                <GoalForm onSubmit={handleAddGoal} isSubmitting={isLoading} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-card flex flex-col items-center justify-center animate-fade-in">
            <p className="text-sm text-muted-foreground">Total Goal Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>
          </div>
          <div className="p-4 border rounded-lg bg-card flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm text-muted-foreground">Current Savings</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalCurrent)}</p>
          </div>
          <div className="p-4 border rounded-lg bg-card flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-2xl font-bold text-success">{totalPercentage}%</p>
            <p className="text-xs text-muted-foreground">
              {completedGoals.length} of {goals.length} goals completed
            </p>
          </div>
        </div>
        
        {goals.length === 0 ? (
          <div className="border rounded-lg bg-card p-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-medium mb-2">No savings goals yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your financial goals by creating your first goal.
            </p>
            {isMobile ? (
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Your First Goal
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Add Goal</DrawerTitle>
                    <DrawerDescription>
                      Create a new savings goal.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <GoalForm onSubmit={handleAddGoal} isSubmitting={isLoading} />
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
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Your First Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Goal</DialogTitle>
                    <DialogDescription>
                      Create a new savings goal.
                    </DialogDescription>
                  </DialogHeader>
                  <GoalForm onSubmit={handleAddGoal} isSubmitting={isLoading} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {incompleteGoals.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">In Progress</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {incompleteGoals.map((goal, index) => (
                    <div key={goal.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <GoalCard goal={goal} showDetails={true} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {completedGoals.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Completed</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedGoals.map((goal, index) => (
                    <div key={goal.id} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <GoalCard goal={goal} showDetails={true} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
