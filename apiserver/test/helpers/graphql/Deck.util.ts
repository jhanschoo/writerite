import { WrServer } from "../../../src/graphqlServer";
import { gql, inject } from "../misc";
import { DeckAddSubdeckMutation, DeckAddSubdeckMutationVariables, DeckCreateEmptyMutation, DeckEditNameMutation, DeckEditNameMutationVariables, DeckQuery, DeckQueryVariables, DeckRemoveSubdeckMutation, DeckRemoveSubdeckMutationVariables, DecksQuery, DeckUsedMutation, DeckUsedMutationVariables } from "../../../generated/typescript-operations";

export async function mutationDeckCreateEmpty(server: WrServer) {
	return inject<DeckCreateEmptyMutation, undefined>({
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

export async function mutationDeckAddSubdeck(server: WrServer, variables: DeckAddSubdeckMutationVariables) {
	return inject<DeckAddSubdeckMutation, DeckAddSubdeckMutationVariables>({
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

export async function mutationDeckRemoveSubdeck(server: WrServer, variables: DeckRemoveSubdeckMutationVariables) {
	return inject<DeckRemoveSubdeckMutation, DeckRemoveSubdeckMutationVariables>({
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

export async function mutationDeckEditName(server: WrServer, variables: DeckEditNameMutationVariables) {
	return inject<DeckEditNameMutation, DeckEditNameMutationVariables>({
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

export async function mutationDeckUsed(server: WrServer, variables: DeckUsedMutationVariables) {
	return inject<DeckUsedMutation, DeckUsedMutationVariables>({
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

export async function queryDeckScalars(server: WrServer, id: string) {
	return inject<DeckQuery, DeckQueryVariables>({
		server,
		document: gql`
			query Deck($id: ID!) {
				deck(id: $id) {
					id
					answerLang
					archived
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
	return inject<DecksQuery, undefined>({
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
