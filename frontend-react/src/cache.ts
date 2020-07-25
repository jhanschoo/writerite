/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InMemoryCache } from "@apollo/client";
import { persistCache } from "apollo-cache-persist";
import possibleTypes from "./possibleTypes.json";


export const cache = new InMemoryCache({
  possibleTypes,
  typePolicies: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Deck: {
      fields: {
        subdecks: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

// https://github.com/apollographql/apollo-cache-persist/issues/317
export const persistedCacheStatus = persistCache({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  cache,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  storage: window.localStorage,
});

