import { SSRExchange } from 'next-urql';
import { dedupExchange, fetchExchange, makeOperation, subscriptionExchange } from 'urql/core';
import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange, Data, NullArray } from '@urql/exchange-graphcache';
import { getAccessKey } from '@lib/tokenManagement';
import { createClient } from 'graphql-ws';
import WebSocket from 'isomorphic-ws';
import schema from '@root/graphql.schema.json';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import { isSSRContext, NEXT_PUBLIC_GRAPHQL_HTTP, NEXT_PUBLIC_GRAPHQL_WS } from '@/utils';
import { DeckCardsDirectCountFragmentDoc, Mutation } from '@generated/graphql';

export const commonUrqlOptions = {
  url: NEXT_PUBLIC_GRAPHQL_HTTP,
  requestPolicy: 'cache-and-network',
  // preferGetMethod: true seems to be necessary for my implementation of subscriptions to work
  // preferGetMethod: true,
} as const;

const wsClient = createClient({
  url: NEXT_PUBLIC_GRAPHQL_WS,
  webSocketImpl: WebSocket,
});

const auth = authExchange<string | null>({
  addAuthToOperation({ authState, operation }) {
    if (isSSRContext() || !authState) {
      return operation;
    }
    const prevFetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};
    const fetchOptions = {
      ...prevFetchOptions,
      headers: {
        ...prevFetchOptions.headers,
        Authorization: `Bearer ${authState}`,
      },
    };

    return makeOperation(operation.kind, operation, {
      ...operation.context,
      fetchOptions,
    });
  },
  async getAuth({ authState }) {
    return authState || getAccessKey();
  },
  didAuthError({ authState }) {
    return authState === null;
  },
});

const subscription = subscriptionExchange({
  forwardSubscription: (operation) => ({
    subscribe: (sink) => ({
      unsubscribe: wsClient.subscribe(operation, sink),
    }),
  }),
});

export const getExchanges = (ssr: SSRExchange) => [
  devtoolsExchange,
  dedupExchange,
  cacheExchange({
    schema: schema as IntrospectionData,
    updates: {
      Mutation: {
        cardCreate(result, _args, cache, _info) {
          const { cardCreate: card } = result as Mutation;
          const { id, deckId } = card;
          const cardsDirect = cache.resolve({ __typename: 'Deck', id: deckId as string }, 'cardsDirect');
          if (Array.isArray(cardsDirect)) {
            cardsDirect.unshift({ __typename: 'Card', id });
            cache.link({ __typename: 'Deck', id: deckId as string }, 'cardsDirect', cardsDirect as NullArray<Data>);
            cache.writeFragment(DeckCardsDirectCountFragmentDoc, { id: deckId as string, cardsDirectCount: cardsDirect.length });
          }
        },
        cardDelete(result, _args, cache, _info) {
          const { cardDelete: { id, deckId } } = result as Mutation;
          const cardsDirect = cache.resolve({ __typename: 'Deck', id: deckId as string }, 'cardsDirect');
          const deletedCardKey = cache.keyOfEntity({ __typename: 'Card', id })
          if (Array.isArray(cardsDirect)) {
            const updatedCards = cardsDirect.filter((cardKey) => cardKey !== deletedCardKey);
            cache.link({ __typename: 'Deck', id: deckId as string }, 'cardsDirect', updatedCards);
            cache.writeFragment(DeckCardsDirectCountFragmentDoc, { id: deckId as string, cardsDirectCount: updatedCards.length });
          }
        },
        // deckAddSubdeck requires no cache updates since ...deckSubdecks is returned which automatically updates the cache
        // deckRemoveSubdeck requires no cache updates since ...deckSubdecks is returned which automatically updates the cache
      }
    }
  }),
  ssr,
  auth,
  fetchExchange,
  subscription,
];
