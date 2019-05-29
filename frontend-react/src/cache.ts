import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

export const cache = new InMemoryCache();

export const persistedCache = persistCache({
  cache,
  // @ts-ignore
  storage: window.localStorage,
});
