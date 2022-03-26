import { WrServer } from "../../../src/graphqlServer";
import { CurrentUser } from "../../../src/types";
import { unsafeJwtToCurrentUser } from "../misc";

export const DEFAULT_CREATE_USER_VALUES = {
	name: "abcxyz",
};

export function createUser(server: WrServer, { name }: { name: string } = DEFAULT_CREATE_USER_VALUES) {
	return server.inject({
		document: `
			mutation CreateUser($code: String!, $nonce: String!, $provider: String!, $redirect_uri: String!) {
				finalizeThirdPartyOauthSignin(code: $code, nonce: $nonce, provider: $provider, redirect_uri: $redirect_uri)
			}
		`,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		variables: { code: name, nonce: "", provider: "development", redirect_uri: "" },
	});
}

export function nameUser(server: WrServer, { name }: { name: string } = DEFAULT_CREATE_USER_VALUES) {
	return server.inject({
		document: `
			mutation UserEdit($name: String!) {
				userEdit(name: $name) {
					id
					name
				}
			}
		`,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		variables: { name },
	});
}

export async function loginAsNewlyCreatedUser(server: WrServer, setSub: (sub?: CurrentUser) => void): Promise<CurrentUser> {
	const { executionResult } = await createUser(server);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const currentUser = unsafeJwtToCurrentUser(executionResult.data.finalizeThirdPartyOauthSignin as string);
	setSub(currentUser);
	return currentUser;
}

export function queryAllUserAccessibleUserScalars(server: WrServer, id: string) {
	return server.inject({
		document: `
			query QueryUser($id: ID!) {
				user(id: $id) {
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
