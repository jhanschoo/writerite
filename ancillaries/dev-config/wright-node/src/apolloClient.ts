import fetch from "node-fetch";

import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";
import { RetryLink } from "@apollo/client/link/retry";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloClient, HttpLink, from, split } from "@apollo/client";

import { agent } from "./agent";
import { AgentWebSocket } from "./websocket";
import { cache } from "./cache";
import { Agent } from "http";

// eslint-disable-next-line @typescript-eslint/naming-convention
const {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GRAPHQL_HTTP,
  GRAPHQL_WS,
  WRIGHT_SECRET_JWT,
} = process.env as Record<string, string>;

const Authorization = `Bearer ${WRIGHT_SECRET_JWT}`;

const httpLink = new HttpLink({
  includeExtensions: true,
  uri: GRAPHQL_HTTP,
  credentials: "same-origin",
  fetch,
  fetchOptions: {
    agent,
  },
});

const wsClient = new SubscriptionClient(
  GRAPHQL_WS,
  {
    reconnect: true,
    connectionParams: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization,
    },
  },
  AgentWebSocket
);

export const wsLink = new WebSocketLink(wsClient);

const retryLink = new RetryLink();

const contextualizedLink = setContext((_, prevContext) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { headers } = prevContext;
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...headers,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization,
    },
  };
});

const logLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations
          ?.map((loc) => `${loc.column},${loc.line}`)
          .join(" ")}, Path: ${path?.join("|")}`
      )
    );
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error(
      `[Network error]: ${networkError.name}, ${networkError.message}`
    );
  }
});

const link = from([
  logLink,
  contextualizedLink,
  retryLink,
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  ),
]);

// end to disable if SSR

export const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "network-only",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "network-only",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
