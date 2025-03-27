
import { gql } from '@apollo/client';

// Transactions queries
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactionsCollection {
      edges {
        node {
          id
          amount
          category
          date
          description
          type
          user_id
        }
      }
    }
  }
`;

// Goals queries
export const GET_GOALS = gql`
  query GetGoals {
    goalsCollection {
      edges {
        node {
          id
          title
          target_amount
          current_amount
          end_date
          user_id
        }
      }
    }
  }
`;

// Goal contributions queries
export const GET_GOAL_CONTRIBUTIONS = gql`
  query GetGoalContributions($goalId: UUID!) {
    goal_contributionsCollection(filter: {goal_id: {eq: $goalId}}) {
      edges {
        node {
          id
          amount
          date
          goal_id
          user_id
        }
      }
    }
  }
`;

// Profile queries
export const GET_PROFILE = gql`
  query GetProfile($userId: UUID!) {
    profilesCollection(filter: {id: {eq: $userId}}) {
      edges {
        node {
          id
          full_name
          avatar_url
        }
      }
    }
  }
`;
