import { WrServer } from "../../../src/graphqlServer";
import { CurrentUser } from "../../../src/types";
import { gql, inject, unsafeJwtToCurrentUser } from "../misc";
import { CreateUserMutation, CreateUserMutationVariables, NameUserMutation, NameUserMutationVariables, UserAccessibleUserScalarsQuery, UserAccessibleUserScalarsQueryVariables, UserEditMutation, UserEditMutationVariables, UserPublicScalarsQuery, UserPublicScalarsQueryVariables } from "../../../generated/typescript-operations";

export const DEFAULT_CREATE_USER_VALUES = {
  name: "abcxyz",
};

export function createUser(server: WrServer, { name }: { name: string } = DEFAULT_CREATE_USER_VALUES) {
  return inject<CreateUserMutation, CreateUserMutationVariables>({
    server,
    document: gql`
      mutation CreateUser($code: String!, $nonce: String!, $provider: String!, $redirect_uri: String!) {
        finalizeThirdPartyOauthSignin(code: $code, nonce: $nonce, provider: $provider, redirect_uri: $redirect_uri)
      }
    `,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    variables: { code: name, nonce: "", provider: "development", redirect_uri: "" },
  });
}

export function nameUser(server: WrServer, { name }: { name: string } = DEFAULT_CREATE_USER_VALUES) {
  return inject<NameUserMutation, NameUserMutationVariables>({
    server,
    document: gql`
      mutation NameUser($name: String!) {
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

export async function loginAsNewlyCreatedUser(server: WrServer, setSub: (sub?: CurrentUser) => void, name?: string): Promise<CurrentUser> {
  const { executionResult } = await (name ? createUser(server, { name }) : createUser(server));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
  const currentUser = unsafeJwtToCurrentUser(executionResult!.data!.finalizeThirdPartyOauthSignin as string);
  setSub(currentUser);
  return currentUser;
}

export function queryAllUserAccessibleUserScalars(server: WrServer, id: string) {
  return inject<UserAccessibleUserScalarsQuery, UserAccessibleUserScalarsQueryVariables>({
    server,
    document: gql`
      query UserAccessibleUserScalars($id: ID!) {
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
  return inject<UserPublicScalarsQuery, UserPublicScalarsQueryVariables>({
    server,
    document: gql`
      query UserPublicScalars($id: ID!) {
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
  return inject<UserEditMutation, UserEditMutationVariables>({
    server,
    document: gql`
      mutation UserEdit($name: String, $isPublic: Boolean) {
        userEdit(name: $name, isPublic: $isPublic) {
          id
        }
      }
    `,
    variables: { name, isPublic },
  });
}
