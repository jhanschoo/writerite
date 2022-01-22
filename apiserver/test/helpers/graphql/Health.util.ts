import { GraphQLResponse } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-koa";

export async function queryHealth(apollo: ApolloServer): Promise<GraphQLResponse> {
	return apollo.executeOperation({
		operationName: "HealthQuery",
		query: gql`
			query HealthQuery {
				health
			}
		`,
	});
}
