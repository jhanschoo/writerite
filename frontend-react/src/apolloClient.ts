import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { SubscriptionClient } from "subscriptions-transport-ws";
import MessageTypes from "subscriptions-transport-ws/dist/message-types";
import { WebSocketLink } from "@apollo/client/link/ws";
import { RetryLink } from "@apollo/client/link/retry";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloClient, from, split } from "@apollo/client";

import { cache } from "./cache";
import { getAuth } from "./util";

const httpLink = new BatchHttpLink({
  includeExtensions: true,
  uri: process.env.REACT_APP_GRAPHQL_HTTP,
  credentials: "same-origin",
});

if (!process.env.REACT_APP_GRAPHQL_WS) {
  throw new Error("REACT_APP_GRAPHQL_WS envvar is missing");
}

const wsClient = new SubscriptionClient(process.env.REACT_APP_GRAPHQL_WS, {
  reconnect: true,
  connectionParams: () => {
    const Authorization = getAuth();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return Authorization ? { Authorization } : {};
  },
});

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
      Authorization: getAuth(),
    },
  };
});

const logLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations?.map((loc) => `${loc.column},${loc.line}`).join(" ")}, Path: ${path?.join("|")}`));
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error(`[Network error]: ${networkError.name}, ${networkError.message}`);
  }
});

const link = from([
  logLink,
  contextualizedLink,
  retryLink,
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" &&
        definition.operation === "subscription";
    },
    wsLink,
    httpLink,
  ),
]);

export const client = new ApolloClient({
  link,
  cache,
  ssrForceFetchDelay: 100,
  connectToDevTools: process.env.NODE_ENV !== "production",
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      partialRefetch: true,
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "network-only",
      /*
       * TODO: determine if error is expected
       * partialRefetch: true,
       */
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

/*
 * see following for authentication strategies. Note we are using
 * a private API due to the inability of the public API to handle
 * reconnects
 * https://github.com/apollographql/subscriptions-transport-ws/issues/171
 */
export const restartWsConnection = (): void => {
  // Copy current operations
  const operations = { ...wsClient.operations };

  try {
    // Close connection
    wsClient.close();
    /*
     * Open a new one
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wsClient.connect();
  } catch (e) { }


  // Push all current operations to the new connection
  for (const id of Object.keys(operations)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wsClient.sendMessage(
      id,
      MessageTypes.GQL_START,
      operations[id].options,
    );
  }
};
