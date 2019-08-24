import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import introspectionQueryResultData from './schema.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

export const cache = new InMemoryCache({ fragmentMatcher });

export const persistedCache = persistCache({
  cache,
  // @ts-ignore
  storage: window.localStorage,
});
