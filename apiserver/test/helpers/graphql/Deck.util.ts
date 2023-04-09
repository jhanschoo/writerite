import { graphql } from "../../../generated/gql";
import { DeckQueryVariables } from "../../../generated/gql/graphql";
import { DecksQueryVariables } from "../../../generated/gql/graphql";
import {
  DeckAddSubdeckMutationVariables,
  DeckCreateEmptyMutationVariables,
  DeckEditMutationVariables,
  DeckRemoveSubdeckMutationVariables,
} from "../../../generated/gql/graphql";
import { testQuery } from "../misc";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

export function mutationDeckCreateEmpty(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckCreateEmptyMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation DeckCreateEmpty(
        $answerLang: String!
        $cards: [CardCreateInput!]!
        $description: JSONObject
        $name: String!
        $notes: JSONObject
        $parentDeckId: ID
        $promptLang: String!
        $published: Boolean
      ) {
        deckCreate(
          answerLang: $answerLang
          cards: $cards
          description: $description
          name: $name
          notes: $notes
          parentDeckId: $parentDeckId
          promptLang: $promptLang
          published: $published
        ) {
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
      mutation DeckEdit(
        $id: ID!
        $name: String
        $answerLang: String
        $description: JSONObject
        $notes: JSONObject
        $promptLang: String
      ) {
        deckEdit(
          id: $id
          name: $name
          answerLang: $answerLang
          description: $description
          notes: $notes
          promptLang: $promptLang
        ) {
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
        $scope: DecksQueryScope
        $stoplist: [ID!]
      ) {
        decks(
          after: $after
          before: $before
          first: $first
          last: $last
          scope: $scope
          stoplist: $stoplist
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
