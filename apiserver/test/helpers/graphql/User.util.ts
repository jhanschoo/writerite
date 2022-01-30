import { WrServer } from "../../../src/graphqlServer";
import { CurrentUser } from "../../../src/types";
import { unsafeJwtToCurrentUser } from "../misc";

export const DEFAULT_CREATE_USER_VALUES = {
	email: "abc@xyz.com",
	token: "not_used",
	authorizer: "DEVELOPMENT",
	identifier: "password",
};

export function createUser(server: WrServer, { email, token, authorizer, identifier }: { email: string, token: string, authorizer: string, identifier: string } = DEFAULT_CREATE_USER_VALUES) {
	return server.inject({
		document: `
			mutation CreateUser($email: String!, $token: String!, $authorizer: String!, $identifier: String!) {
				signin(email: $email, token: $token, authorizer: $authorizer, identifier: $identifier)
			}
		`,
		variables: { email, token, authorizer, identifier },
	});
}

export function createUserWithEmail(server: WrServer, email: string) {
	return createUser(server, { ...DEFAULT_CREATE_USER_VALUES, email });
}

export async function loginAsNewlyCreatedUser(server: WrServer, setSub: (sub?: CurrentUser) => void): Promise<CurrentUser> {
	const { executionResult } = await createUser(server);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const currentUser = unsafeJwtToCurrentUser(executionResult.data.signin as string);
	setSub(currentUser);
	return currentUser;
}

export function queryAllUserAccessibleUserScalars(server: WrServer, id: string) {
	return server.inject({
		document: `
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
}

export function queryUserPublicScalars(server: WrServer, id: string) {
	return server.inject({
		document: `
			query QueryUser($id: ID!) {
				user(id: $id) {
					id
					isPublic
				}
			}
		`,
		variables: { id },
	});
}

export async function mutationUserEdit(server: WrServer, { name, isPublic }: { name?: string, isPublic?: boolean }) {
	return server.inject({
		document: `
			mutation UserEdit($name: String, $isPublic: Boolean) {
				userEdit(name: $name, isPublic: $isPublic) {
					id
				}
			}
		`,
		variables: { name, isPublic },
	});
}
