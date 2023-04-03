import { gql, testQuery } from "../misc";
import {
  DeckAddSubdeckMutationVariables,
  DeckEditNameMutationVariables,
  DeckQueryVariables,
  DeckRemoveSubdeckMutationVariables,
} from "../../../generated/typescript-operations";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

export function mutationDeckCreateEmpty(
  executor: ReturnType<typeof buildHTTPExecutor>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    executor,
    document: gql`
      mutation DeckCreateEmpty {
        deckCreate {
          id
          answerLang
          description
          editedAt
          name
          ownerId
          promptLang
          published
          sortData
        }
      }
    `,
    variables: undefined,
  });
}

export function mutationDeckAddSubdeck(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckAddSubdeckMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckAddSubdeckMutationVariables>({
    executor,
    document: gql`
      mutation DeckAddSubdeck($id: ID!, $subdeckId: ID!) {
        deckAddSubdeck(id: $id, subdeckId: $subdeckId) {
          id
        }
      }
    `,
    variables,
  });
}

export function mutationDeckRemoveSubdeck(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckRemoveSubdeckMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckRemoveSubdeckMutationVariables>({
    executor,
    document: gql`
      mutation DeckRemoveSubdeck($id: ID!, $subdeckId: ID!) {
        deckRemoveSubdeck(id: $id, subdeckId: $subdeckId) {
          id
        }
      }
    `,
    variables,
  });
}

export function mutationDeckEditName(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: DeckEditNameMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckEditNameMutationVariables>({
    executor,
    document: gql`
      mutation DeckEditName($id: ID!, $name: String!) {
        deckEdit(id: $id, name: $name) {
          id
          name
        }
      }
    `,
    variables,
  });
}

export function queryDeckScalars(
  executor: ReturnType<typeof buildHTTPExecutor>,
  id: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckQueryVariables>({
    executor,
    document: gql`
      query Deck($id: ID!) {
        deck(id: $id) {
          id
          answerLang
          description
          editedAt
          name
          ownerId
          promptLang
          published
          sortData
        }
      }
    `,
    variables: { id },
  });
}

export function queryDecks(executor: ReturnType<typeof buildHTTPExecutor>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    executor,
    document: gql`
      query Decks {
        decks {
          id
        }
      }
    `,
    variables: undefined,
  });
}
