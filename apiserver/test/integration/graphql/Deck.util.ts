import { GraphQLResponse } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-koa";

export async function mutationDeckCreateEmpty(apollo: ApolloServer): Promise<GraphQLResponse> {
	const res = await apollo.executeOperation({
		query: gql`
			mutation DeckCreateEmpty {
				deckCreate {
					id
				}
			}
		`,
	});
	return res;
}

export async function queryDeckScalars(apollo: ApolloServer, id: string): Promise<GraphQLResponse> {
	const res = await apollo.executeOperation({
		query: gql`
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
	return res;
}

export async function queryDecks(apollo: ApolloServer): Promise<GraphQLResponse> {
	const res = await apollo.executeOperation({
		query: gql`
			query QueryDecks{
				decks {
					id
				}
			}
		`,
	});
	return res;
}
