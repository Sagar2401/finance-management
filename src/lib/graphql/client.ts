import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { supabase } from "@/integrations/supabase/client";

// Create an HTTP link to the Supabase GraphQL endpoint
const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql/v1`,
});

const authLink = setContext(async (_, { headers }) => {
  // Get the session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    headers: {
      ...headers,
      authorization: session?.access_token
        ? `Bearer ${session.access_token}`
        : "",
      apikey: import.meta.env.VITE_ANON_KEY,
    },
  };
});

// Create the Apollo Client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
