import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { setContext } from 'apollo-link-context';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';
import { withClientState } from 'apollo-link-state';

import { store } from './store';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

// c.f. https://github.com/Akryum/vue-cli-plugin-apollo/blob/master/graphql-client/src/index.js

const getAuth = () => {
  const storeState = store.getState();
  const token = storeState.signin
    && storeState.signin.data && storeState.signin.data.token;
  return token ? `Bearer ${token}` : '';
};

const cache = new InMemoryCache();

persistCache({
  cache,
  // https://github.com/apollographql/apollo-cache-persist/issues/55
  // remove coercion when https://github.com/apollographql/apollo-cache-persist/pull/58 is published
  storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
});

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_HTTP,
  credentials: 'same-origin',
});

let link = httpLink;

const authLink = setContext((_, { headers }) => {
  const authorization = getAuth();
  const authorizationHeader = authorization ? { authorization } : {};
  return {
    headers: {
      ...headers,
      ...authorizationHeader,
    },
  };
});

link = authLink.concat(link);

// to disable if SSR

// recover injected state

// @ts-ignore
const state = window.__APOLLO_STATE__;

if (state) {
  cache.restore(state.defaultClient);
}

// persistence

link = createPersistedQueryLink().concat(link);

// ws

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

const wsLink = new WebSocketLink(wsClient);

link = split(({ query }) => {
  const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
  return kind === 'OperationDefinition' &&
    operation === 'subscription';
}, wsLink, link);

const stateLink = withClientState({
  cache,
  resolvers: {},
});

// end to disable if SSR

const client = new ApolloClient({
  link,
  cache,
  ssrForceFetchDelay: 100,
  connectToDevTools: process.env.NODE_ENV !== 'production',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

client.onResetStore(() => Promise.resolve(stateLink.writeDefaults()));

export { client, wsClient };

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
