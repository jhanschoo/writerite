import { GraphQLResponse } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-koa";

export async function createUser(apollo: ApolloServer, { email, token, authorizer, identifier }: { email: string, token: string, authorizer: string, identifier: string } = {
	email: "abs@xyz.com",
	token: "not_used",
	authorizer: "DEVELOPMENT",
	identifier: "password",
}): Promise<GraphQLResponse> {
	const res = await apollo.executeOperation({
		query: gql`
			mutation CreateUser($email: String!, $token: String!, $authorizer: String!, $identifier: String!) {
				signin(email: $email, token: $token, authorizer: $authorizer, identifier: $identifier)
			}
		`,
		variables: { email, token, authorizer, identifier },
	});
	return res;
}
