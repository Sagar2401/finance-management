import { gql } from "@apollo/client";

// Transaction mutations
export const ADD_TRANSACTION = gql`
  mutation AddTransaction($transaction: transactionsInsertInput!) {
    insertIntotransactionsCollection(objects: [$transaction]) {
      records {
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
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: UUID!) {
    deleteFromtransactionsCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

// Goal mutations
export const ADD_GOAL = gql`
  mutation AddGoal($goal: goalsInsertInput!) {
    insertIntogoalsCollection(objects: [$goal]) {
      records {
        id
        title
        target_amount
        current_amount
        end_date
        user_id
      }
    }
  }
`;

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($id: UUID!, $updates: goalsUpdateInput!) {
    updategoalsCollection(set: $updates, filter: { id: { eq: $id } }) {
      records {
        id
        title
        target_amount
        current_amount
        end_date
      }
    }
  }
`;

export const DELETE_GOAL = gql`
  mutation DeleteGoal($id: UUID!) {
    deleteFromgoalsCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

// Goal contribution mutations
export const ADD_GOAL_CONTRIBUTION = gql`
  mutation AddGoalContribution($contribution: goal_contributionsInsertInput!) {
    insertIntogoal_contributionsCollection(objects: [$contribution]) {
      records {
        id
        amount
        date
        goal_id
        user_id
      }
    }
  }
`;

// Profile mutations
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: UUID!, $updates: profilesUpdateInput!) {
    updateprofilesCollection(set: $updates, filter: { id: { eq: $id } }) {
      records {
        id
        full_name
        avatar_url
      }
    }
  }
`;
