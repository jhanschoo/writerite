import { createUploadLink } from 'apollo-upload-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';
import { WebSocketLink } from 'apollo-link-ws';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { RetryLink } from 'apollo-link-retry';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';

import { cache } from './cache';
import { getAuth } from './util';

const httpUploadLink = createUploadLink({
  includeExtensions: true,
  uri: process.env.REACT_APP_GRAPHQL_HTTP,
  credentials: 'same-origin',
});

if (!process.env.REACT_APP_GRAPHQL_WS) {
  throw new Error('REACT_APP_GRAPHQL_WS envvar is missing');
}

const wsClient = new SubscriptionClient(
  process.env.REACT_APP_GRAPHQL_WS, {
    reconnect: true,
    connectionParams: () => {
      // tslint:disable-next-line: variable-name
      const Authorization = getAuth();
      return Authorization ? { Authorization } : {};
    },
  },
);

export const wsLink = new WebSocketLink(wsClient);

const persistedQueryLink = createPersistedQueryLink();

const retryLink = new RetryLink();

const contextualizedLink = setContext((_, prevContext) => {
  const { headers } = prevContext;
  return {
    headers: {
      ...headers,
      Authorization: getAuth(),
    },
  };
});

const logLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      // tslint:disable-next-line: no-console
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) {
    // tslint:disable-next-line: no-console
    console.log(`[Network error]: ${networkError}`);
  }
});

const link = ApolloLink.from([
  logLink,
  contextualizedLink,
  retryLink,
  persistedQueryLink,
  ApolloLink.split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription';
    },
    wsLink,
    httpUploadLink,
  ),
]);

export const client = new ApolloClient({
  link,
  cache,
  ssrForceFetchDelay: 100,
  connectToDevTools: process.env.NODE_ENV !== 'production',
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    },
    mutate: {
      errorPolicy: 'all',
      fetchPolicy: 'network-only',
    },
  },
});

// see following for authentication strategies. Note we are using
// a private API due to the inability of the public API to handle
// reconnects
// https://github.com/apollographql/subscriptions-transport-ws/issues/171
export const restartWsConnection = (): void => {
  // Copy current operations
  const operations = Object.assign({}, wsClient.operations);

  // Close connection
  wsClient.close();

  // Open a new one
  // @ts-ignore
  wsClient.connect();

  // Push all current operations to the new connection
  Object.keys(operations).forEach((id) => {
    // @ts-ignore
    wsClient.sendMessage(
      id,
      MessageTypes.GQL_START,
      operations[id].options,
    );
  });
};
