import { WrServer } from "../../../src/graphqlServer";
import { gql, inject } from "../misc";
import { DeckCreateEmptyMutation, DeckQuery, DeckQueryVariables, DecksQuery } from "../../../generated/typescript-operations";

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
