import fs from 'fs';
import http from 'http';
import https from 'https';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { RetryLink } from 'apollo-link-retry';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';

import fetch from 'node-fetch';

import './assertConfig';
import { createClient } from './redisClient';
import { URL } from 'url';

const redisClient = createClient();

let TOKEN: string | null = null;

(function refreshToken() {
  redisClient.get('writerite:wright:jwt', (err, token) => {
    if (err) {
      // tslint:disable-next-line: no-console
      console.error(err.message);
    } else {
      TOKEN = token;
    }
    setTimeout(refreshToken, 5000);
  });
})();

const getAuth = () => {
  return TOKEN ? `Bearer ${TOKEN}` : undefined;
};

const cache = new InMemoryCache();

const agent = new https.Agent({
  keepAlive: true,
  ca: (process.env.CA_CERT_FILE === undefined)
    ? undefined
    : fs.readFileSync(process.env.CA_CERT_FILE),
});

const httpUploadLink = createUploadLink({
  includeExtensions: true,
  uri: process.env.GRAPHQL_HTTP,
  credentials: 'same-origin',
  fetch,
  fetchOptions: {
    agent: (url: URL) =>
      (url.protocol === 'http:') ? http.globalAgent : agent,
  },
});

const persistedQueryLink = createPersistedQueryLink();

const retryLink = new RetryLink();

const contextualizedLink = setContext((_, prevContext) => {
  const { headers } = prevContext;
  const authorization = getAuth();
  if (!authorization) {
    return { headers };
  }
  return {
    headers: {
      ...headers,
      authorization,
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
  httpUploadLink,
]);

// end to disable if SSR

export const client = new ApolloClient({
  link,
  cache,
  ssrForceFetchDelay: 100,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
    },
    mutate: {
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
    },
  },
});
