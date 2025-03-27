import React, { useState, useEffect } from "react";
import { Goal } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  PlusCircle,
  TargetIcon,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoals } from "@/hooks/useGoals";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  showDetails?: boolean;
}

export function GoalCard({ goal, showDetails = false }: GoalCardProps) {
  const { updateGoalProgress, contributions, fetchGoalContributions } =
    useGoals();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContributions, setShowContributions] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Ensure percentage calculation is correct and capped at 100%
  const percentage = Math.min(
    Math.round((goal.current / goal.target) * 100),
    100
  );
  const isCompleted = goal.current >= goal.target;

  const goalContributions = contributions[goal.id] || [];

  // Fetch contributions when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      console.log("Float", 1);
      fetchGoalContributions(goal.id);
    }
  }, [isDialogOpen, goal.id]);

  const handleContribute = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;

    setLoading(true);
    const success = await updateGoalProgress(goal.id, parseFloat(amount));

    if (success) {
      setAmount("");
      setIsDialogOpen(false);
    }

    setLoading(false);
  };

  // Compact card for dashboard
  if (!showDetails) {
    return (
      <div className="p-4 rounded-lg border bg-card animate-fade-in card-hover">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-sm">{goal.title}</h3>
            {goal.description && (
              <p className="text-xs text-muted-foreground">
                {goal.description}
              </p>
            )}
          </div>
          <div
            className={`p-1.5 rounded-full ${
              isCompleted ? "bg-success/10" : "bg-primary/10"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            ) : (
              <TargetIcon className="h-3.5 w-3.5 text-primary" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-xs">
            <span>
              <span className="font-medium">
                {formatCurrency(goal.current)}
              </span>
              <span className="text-muted-foreground">
                {" "}
                of {formatCurrency(goal.target)}
              </span>
            </span>
            <span
              className={`font-medium ${
                isCompleted ? "text-success" : "text-primary"
              }`}
            >
              {percentage}%
            </span>
          </div>

          {goal.deadline && (
            <div className="text-xs text-muted-foreground mt-1">
              Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant={isCompleted ? "outline" : "default"}
                className="w-full mt-2"
              >
                {isCompleted ? "View Details" : "Add Contribution"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{goal.title}</DialogTitle>
                <DialogDescription>
                  {isCompleted
                    ? "Goal completed! Here are the details."
                    : "Add a contribution to your savings goal."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>
                      <span className="font-medium">
                        {formatCurrency(goal.current)}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        of {formatCurrency(goal.target)}
                      </span>
                    </span>
                    <span
                      className={`font-medium ${
                        isCompleted ? "text-success" : "text-primary"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>

                {goal.deadline && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                )}

                {!isCompleted && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Contribution Amount</Label>
                    <div className="flex gap-2">
                      <Input
                        id="amount"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        min="0.01"
                        step="0.01"
                      />
                      <Button
                        onClick={handleContribute}
                        disabled={loading || !amount || parseFloat(amount) <= 0}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowContributions(!showContributions)}
                  >
                    {showContributions ? "Hide" : "Show"} Contribution History
                  </Button>

                  {showContributions && (
                    <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto">
                      {goalContributions.length > 0 ? (
                        goalContributions.map((contribution) => (
                          <div
                            key={contribution.id}
                            className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                          >
                            <span className="text-sm">
                              {contribution.date.toLocaleDateString()}
                            </span>
                            <span className="font-medium text-sm">
                              {formatCurrency(contribution.amount)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-2 text-sm text-muted-foreground">
                          No contributions yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Detailed view for the Goals page
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{goal.title}</CardTitle>
            {goal.description && (
              <CardDescription>{goal.description}</CardDescription>
            )}
          </div>
          <div
            className={`p-2 rounded-full ${
              isCompleted ? "bg-success/10" : "bg-primary/10"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <TargetIcon className="h-4 w-4 text-primary" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Progress value={percentage} className="h-2" />
            <div className="flex justify-between text-sm">
              <span>
                <span className="font-medium">
                  {formatCurrency(goal.current)}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  of {formatCurrency(goal.target)}
                </span>
              </span>
              <span
                className={`font-medium ${
                  isCompleted ? "text-success" : "text-primary"
                }`}
              >
                {percentage}%
              </span>
            </div>
          </div>

          {goal.deadline && (
            <div className="text-sm text-muted-foreground">
              Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </div>
          )}

          {!isCompleted && (
            <div className="pt-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Contribution
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Contribution</DialogTitle>
                    <DialogDescription>
                      Add a contribution to your {goal.title} goal.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="contrib-amount">Amount</Label>
                      <Input
                        id="contrib-amount"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleContribute}
                      disabled={loading || !amount || parseFloat(amount) <= 0}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Contribution"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowContributions(!showContributions)}
            >
              {showContributions ? "Hide" : "Show"} Contribution History
            </Button>

            {showContributions && (
              <div className="mt-4 space-y-2">
                {goalContributions.length > 0 ? (
                  goalContributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                    >
                      <span className="text-sm">
                        {contribution.date.toLocaleDateString()}
                      </span>
                      <span className="font-medium text-sm">
                        {formatCurrency(contribution.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    No contributions yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
