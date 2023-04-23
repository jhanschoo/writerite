import {
  NEXT_PUBLIC_GRAPHQL_HTTP,
  NEXT_PUBLIC_GRAPHQL_WS,
  isSSRContext,
} from '@/utils';
import { graphql } from '@generated/gql';
import schema from '@generated/schema.graphql.json';
import {
  getAccessToken,
  sessionNeedsRefreshing,
  setSessionInfo,
  unsetSessionInfo,
} from '@lib/tokenManagement';
import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { Data, NullArray, cacheExchange } from '@urql/exchange-graphcache';
// import { DeckCardsDirectCountFragmentDoc, Mutation, RefreshDocument } from '@generated/graphql';
import { IntrospectionQuery } from 'graphql';
import { createClient } from 'graphql-ws';
import WebSocket from 'isomorphic-ws';
import { Exchange, fetchExchange, subscriptionExchange } from 'urql/core';

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

export const AuthRefreshMutation = graphql(/* GraphQL */ `
  mutation AuthRefreshMutation($token: JWT!) {
    refresh(token: $token) {
      currentUser
      token
    }
  }
`);

const auth = authExchange(async ({ appendHeaders, mutate }) => {
  let token = getAccessToken();
  const ssrContext = isSSRContext();
  return {
    addAuthToOperation(operation) {
      if (ssrContext || !token) {
        return operation;
      }
      return appendHeaders(operation, {
        Authorization: `Bearer ${token}`,
      });
    },
    willAuthError() {
      if (!token) {
        token = getAccessToken();
      }
      return sessionNeedsRefreshing();
    },
    didAuthError(error) {
      return error.graphQLErrors.some(
        (e) => e.extensions.wrCode === 'USER_NOT_LOGGED_IN'
      );
    },
    async refreshAuth() {
      if (!token) {
        unsetSessionInfo();
        return;
      }
      const result = await mutate(AuthRefreshMutation, { token });
      const sessionInfo = result.data?.refresh;
      if (!sessionInfo) {
        unsetSessionInfo();
        return;
      }
      setSessionInfo({
        token: sessionInfo.token,
        currentUser: JSON.stringify(sessionInfo.currentUser),
      });
      token = sessionInfo.token;
    },
  };
});

const subscription = subscriptionExchange({
  forwardSubscription: (request) => {
    const input = { ...request, query: request.query || '' };
    return {
      subscribe: (sink) => ({
        unsubscribe: wsClient.subscribe(input, sink),
      }),
    };
  },
});

export const getExchanges = (ssr: Exchange) => [
  devtoolsExchange,
  auth,
  cacheExchange({
    schema: schema as unknown as IntrospectionQuery, // type mismatch when using graphql.schema.json
    // TODO: review
    // updates: {
    //   Mutation: {
    //     cardCreate(result, _args, cache) {
    //       const { cardCreate: card } = result as Mutation;
    //       const { id, deckId } = card;
    //       const cardsDirect = cache.resolve(
    //         { __typename: 'Deck', id: deckId as string },
    //         'cardsDirect'
    //       );
    //       if (Array.isArray(cardsDirect)) {
    //         cardsDirect.unshift({ __typename: 'Card', id });
    //         cache.link(
    //           { __typename: 'Deck', id: deckId as string },
    //           'cardsDirect',
    //           cardsDirect as NullArray<Data>
    //         );
    //         cache.writeFragment(DeckCardsDirectCountFragmentDoc, {
    //           __typename: 'Deck',
    //           id: deckId as string,
    //           cardsDirectCount: cardsDirect.length,
    //         });
    //       }
    //     },
    //     cardDelete(result, _args, cache) {
    //       const {
    //         cardDelete: { id, deckId },
    //       } = result as Mutation;
    //       const cardsDirect = cache.resolve(
    //         { __typename: 'Deck', id: deckId as string },
    //         'cardsDirect'
    //       );
    //       const deletedCardKey = cache.keyOfEntity({ __typename: 'Card', id });
    //       if (Array.isArray(cardsDirect)) {
    //         const updatedCards = cardsDirect.filter((cardKey) => cardKey !== deletedCardKey);
    //         cache.link({ __typename: 'Deck', id: deckId as string }, 'cardsDirect', updatedCards);
    //         cache.writeFragment(DeckCardsDirectCountFragmentDoc, {
    //           __typename: 'Deck',
    //           id: deckId as string,
    //           cardsDirectCount: updatedCards.length,
    //         });
    //       }
    //     },
    //     // deckAddSubdeck requires no cache updates since ...deckSubdecks is returned which automatically updates the cache
    //     // deckRemoveSubdeck requires no cache updates since ...deckSubdecks is returned which automatically updates the cache
    //   },
    // },
  }),
  ssr,
  fetchExchange,
  subscription,
];
