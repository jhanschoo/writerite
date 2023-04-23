import { buildHTTPExecutor } from '@graphql-tools/executor-http';

import { graphql } from '../../generated/gql';
import {
  DeckAddSubdeckMutationVariables,
  DeckCreateEmptyMutationVariables,
  DeckEditMutationVariables,
  DeckQueryVariables,
  DeckRemoveSubdeckMutationVariables,
  DecksQueryVariables,
} from '../../generated/gql/graphql';
import { testQuery } from '../misc';

export function mutationDeckCreateEmpty(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckCreateEmptyMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation DeckCreateEmpty($input: DeckCreateMutationInput!) {
        deckCreate(input: $input) {
          id
          answerLang
          description
          editedAt
          name
          owner {
            id
          }
          promptLang
          published
          sortData
        }
      }
    `),
    variables,
  });
}

export function mutationDeckAddSubdeck(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckAddSubdeckMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation DeckAddSubdeck($deckId: ID!, $subdeckId: ID!) {
        deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {
          id
        }
      }
    `),
    variables,
  });
}

export function mutationDeckRemoveSubdeck(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckRemoveSubdeckMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation DeckRemoveSubdeck($deckId: ID!, $subdeckId: ID!) {
        deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {
          id
        }
      }
    `),
    variables,
  });
}

export function mutationDeckEditName(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckEditMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation DeckEdit($input: DeckEditMutationInput!) {
        deckEdit(input: $input) {
          id
          name
        }
      }
    `),
    variables,
  });
}

export function queryDeckBasic(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckQueryVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      query Deck($id: ID!) {
        deck(id: $id) {
          answerLang
          description
          editedAt
          name
          owner {
            id
          }
          promptLang
          published
          sortData
        }
      }
    `),
    variables,
  });
}

export function queryDecks(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DecksQueryVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      query Decks(
        $after: ID
        $before: ID
        $first: Int
        $last: Int
        $input: DecksQueryInput!
      ) {
        decks(
          after: $after
          before: $before
          first: $first
          last: $last
          input: $input
        ) {
          edges {
            cursor
            node {
              id
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }
    `),
    variables,
  });
}
