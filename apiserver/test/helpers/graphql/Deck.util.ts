import { WrServer } from "../../../src/graphqlApp";
import { gql, testQuery } from "../misc";
import { DeckAddSubdeckMutationVariables, DeckEditNameMutationVariables, DeckQueryVariables, DeckRemoveSubdeckMutationVariables, DeckUsedMutationVariables } from "../../../generated/typescript-operations";

export function mutationDeckCreateEmpty(server: WrServer) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    server,
    document: gql`
      mutation DeckCreateEmpty {
        deckCreate {
          id
        }
      }
    `,
    variables: undefined,
  });
}

export function mutationDeckAddSubdeck(server: WrServer, variables: DeckAddSubdeckMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckAddSubdeckMutationVariables>({
    server,
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

export function mutationDeckRemoveSubdeck(server: WrServer, variables: DeckRemoveSubdeckMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckRemoveSubdeckMutationVariables>({
    server,
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

export function mutationDeckEditName(server: WrServer, variables: DeckEditNameMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckEditNameMutationVariables>({
    server,
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

export function mutationDeckUsed(server: WrServer, variables: DeckUsedMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckUsedMutationVariables>({
    server,
    document: gql`
      mutation DeckUsed($id: ID!) {
        deckUsed(id: $id) {
          id
        }
      }
    `,
    variables,
  });
}

export function queryDeckScalars(server: WrServer, id: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<DeckQueryVariables>({
    server,
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
          usedAt
        }
      }
    `,
    variables: { id },
  });
}

export function queryDecks(server: WrServer) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    server,
    document: gql`
      query Decks{
        decks {
          id
        }
      }
    `,
    variables: undefined,
  });
}
