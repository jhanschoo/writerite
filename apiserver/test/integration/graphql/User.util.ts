import { GraphQLResponse } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-koa";

export const DEFAULT_CREATE_USER_VALUES = {
	email: "abc@xyz.com",
	token: "not_used",
	authorizer: "DEVELOPMENT",
	identifier: "password",
};

export async function createUser(apollo: ApolloServer, { email, token, authorizer, identifier }: { email: string, token: string, authorizer: string, identifier: string } = DEFAULT_CREATE_USER_VALUES): Promise<GraphQLResponse> {
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

export async function createUserWithEmail(apollo: ApolloServer, email: string): Promise<GraphQLResponse> {
	return createUser(apollo, { ...DEFAULT_CREATE_USER_VALUES, email });
}

export async function queryAllUserAccessibleUserScalars(apollo: ApolloServer, id: string): Promise<GraphQLResponse> {
	const res = await apollo.executeOperation({
		query: gql`
			query QueryUser($id: ID!) {
				user(id: $id) {
					email
					id
					isPublic
					name
					roles
				}
			}
		`,
		variables: { id },
	});
	return res;
}

export async function queryUserPublicScalars(apollo: ApolloServer, id: string): Promise<GraphQLResponse> {
	const res = await apollo.executeOperation({
		query: gql`
			query QueryUser($id: ID!) {
				user(id: $id) {
					id
					isPublic
				}
			}
		`,
		variables: { id },
	});
	return res;
}

export async function mutationUserEdit(apollo: ApolloServer, { name, isPublic }: { name?: string, isPublic?: boolean }): Promise<GraphQLResponse> {
	const res = await apollo.executeOperation({
		query: gql`
			mutation UserEdit($name: String, $isPublic: Boolean) {
				userEdit(name: $name, isPublic: $isPublic) {
					id
				}
			}
		`,
		variables: { name, isPublic },
	});
	return res;
}
