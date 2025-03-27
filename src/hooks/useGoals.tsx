import { useState, useEffect } from "react";
import { Goal, GoalContribution } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GOALS, GET_GOAL_CONTRIBUTIONS } from "@/lib/graphql/queries";
import {
  ADD_GOAL,
  UPDATE_GOAL,
  DELETE_GOAL,
  ADD_GOAL_CONTRIBUTION,
} from "@/lib/graphql/mutations";
import { supabase } from "@/integrations/supabase/client";

interface GoalFormData {
  title: string;
  description?: string;
  target: string;
  hasDeadline: boolean;
  deadline?: Date;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<
    Record<string, GoalContribution[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_GOALS, {
    fetchPolicy: "network-only",
  });

  const [addGoalMutation] = useMutation(ADD_GOAL);
  const [updateGoalMutation] = useMutation(UPDATE_GOAL);
  const [deleteGoalMutation] = useMutation(DELETE_GOAL);
  const [addContributionMutation] = useMutation(ADD_GOAL_CONTRIBUTION);

  useEffect(() => {
    if (data && data.goalsCollection) {
      const formattedGoals: Goal[] = data.goalsCollection.edges.map(
        (edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          description: "", // Add empty string as fallback since description doesn't exist in the table
          target: parseFloat(edge.node.target_amount.toString()),
          current: parseFloat(edge.node.current_amount.toString()),
          deadline: edge.node.end_date
            ? new Date(edge.node.end_date)
            : undefined,
        })
      );
      setGoals(formattedGoals);

      formattedGoals.forEach((goal) => {
        fetchGoalContributions(goal.id);
      });
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(loading);
    if (!loading && data) {
      setIsInitialized(true);
    }
  }, [loading, data]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive",
      });
    }
  }, [error]);

  const fetchGoalContributions = async (goalId: string) => {
    try {
      const { data, error } = await supabase
        .from("goal_contributions")
        .select("*")
        .eq("goal_id", goalId)
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedContributions = data.map((item) => ({
        id: item.id,
        goalId: item.goal_id,
        amount: parseFloat(item.amount.toString()),
        date: new Date(item.date),
      }));

      setContributions((prev) => ({
        ...prev,
        [goalId]: formattedContributions,
      }));

      return formattedContributions;
    } catch (error) {
      console.error("Error fetching goal contributions:", error);
      return [];
    }
  };

  const addGoal = async (data: GoalFormData) => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const newGoal = {
        user_id: user.id,
        title: data.title,
        target_amount: data.target.toString(),
        current_amount: "0",
        end_date:
          data.hasDeadline && data.deadline
            ? data.deadline.toISOString()
            : null,
      };

      const { data: result, errors } = await addGoalMutation({
        variables: {
          goal: newGoal,
        },
      });

      if (errors) {
        throw errors;
      }

      const insertedGoal = result.insertIntogoalsCollection.records[0];

      const formattedGoal: Goal = {
        id: insertedGoal.id,
        title: insertedGoal.title,
        description: "",
        target: parseFloat(insertedGoal.target_amount.toString()),
        current: parseFloat(insertedGoal.current_amount.toString()),
        deadline: insertedGoal.end_date
          ? new Date(insertedGoal.end_date)
          : undefined,
      };

      setGoals((prev) => [...prev, formattedGoal]);

      toast({
        title: "Goal created",
        description: `Successfully created "${data.title}" goal.`,
      });

      return formattedGoal;
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    setIsLoading(true);

    try {
      const goal = goals.find((g) => g.id === id);

      if (!goal) {
        throw new Error("Goal not found");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const newCurrent = Math.min(goal.current + amount, goal.target);

      const { data: contributionResult, errors: contributionErrors } =
        await addContributionMutation({
          variables: {
            contribution: {
              goal_id: id,
              user_id: user.id,
              amount: amount.toString(),
              date: new Date().toISOString(),
            },
          },
        });

      if (contributionErrors) {
        throw contributionErrors;
      }

      const { data: goalResult, errors: goalErrors } = await updateGoalMutation(
        {
          variables: {
            id: id,
            updates: {
              current_amount: newCurrent.toString(),
            },
          },
        }
      );

      if (goalErrors) {
        throw goalErrors;
      }

      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === id) {
            return { ...g, current: newCurrent };
          }
          return g;
        })
      );

      await fetchGoalContributions(id);

      toast({
        title: "Goal updated",
        description: `Successfully added contribution to goal.`,
      });

      return true;
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    setIsLoading(true);

    try {
      const { data: result, errors } = await deleteGoalMutation({
        variables: { id },
      });

      if (errors) {
        throw errors;
      }

      setGoals((prev) => prev.filter((goal) => goal.id !== id));

      setContributions((prev) => {
        const newContributions = { ...prev };
        delete newContributions[id];
        return newContributions;
      });

      toast({
        title: "Goal deleted",
        description: "Successfully deleted goal.",
      });

      return true;
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    goals,
    contributions,
    isLoading,
    isInitialized,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    fetchGoalContributions,
  };
}
