import { WrServer } from "../../../src/graphqlServer";

export async function mutationDeckCreateEmpty(server: WrServer) {
	return server.inject({
		document: `
			mutation DeckCreateEmpty {
				deckCreate {
					id
				}
			}
		`,
	});
}

export async function queryDeckScalars(server: WrServer, id: string) {
	return server.inject({
		document: `
			query QueryDeck($id: ID!) {
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
	return server.inject({
		document: `
			query QueryDecks{
				decks {
					id
				}
			}
		`,
	});
}
