import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery, unsafeJwtToCurrentUser } from '../misc';
import {
  CreateUserMutationVariables,
  MutationRefreshArgs,
  NameUserMutationVariables,
  RefreshMutationVariables,
  UserAccessibleUserScalarsQueryVariables,
  UserEditMutationVariables,
  UserPublicScalarsQueryVariables,
} from '../../../generated/typescript-operations';
import { CurrentUser } from '../../../src/service/userJWT';

export const DEFAULT_CREATE_USER_VALUES = {
  name: 'abcxyz',
};

export function mutationCreateUser(
  server: WrServer,
  { name }: { name: string } = DEFAULT_CREATE_USER_VALUES
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<CreateUserMutationVariables>({
    server,
    document: gql`
      mutation CreateUser(
        $code: String!
        $nonce: String!
        $provider: String!
        $redirect_uri: String!
      ) {
        finalizeOauthSignin(
          code: $code
          nonce: $nonce
          provider: $provider
          redirect_uri: $redirect_uri
        )
      }
    `,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    variables: { code: name, nonce: '', provider: 'development', redirect_uri: '' },
  });
}

export function mutationNameUser(
  server: WrServer,
  { name }: { name: string } = DEFAULT_CREATE_USER_VALUES
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<NameUserMutationVariables>({
    server,
    document: gql`
      mutation NameUser($name: String!) {
        userEdit(name: $name) {
          id
          name
        }
      }
    `,
    variables: { name },
  });
}

export async function loginAsNewlyCreatedUser(
  server: WrServer,
  setSub: (sub?: CurrentUser) => void,
  name?: string
): Promise<{ currentUser: CurrentUser; token: string }> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await (name ? mutationCreateUser(server, { name }) : mutationCreateUser(server));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const token = response.data.finalizeOauthSignin as string;
  const currentUser = unsafeJwtToCurrentUser(token);
  setSub(currentUser);
  return { currentUser, token };
}

export async function refreshLogin(
  server: WrServer,
  setSub: (sub?: CurrentUser) => void,
  token: string
): Promise<{ currentUser: CurrentUser; token: string }> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await mutationRefresh(server, token);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const updatedToken = response.data.refresh as string;
  const currentUser = unsafeJwtToCurrentUser(updatedToken);
  setSub(currentUser);
  return { currentUser, token };
}

export async function mutationRefresh(server: WrServer, token: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RefreshMutationVariables>({
    server,
    document: gql`
      mutation Refresh($token: JWT!) {
        refresh(token: $token)
      }
    `,
    variables: { token },
  });
}

export function queryAllUserAccessibleUserScalars(server: WrServer, id: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserAccessibleUserScalarsQueryVariables>({
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserPublicScalarsQueryVariables>({
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

export function mutationUserEdit(
  server: WrServer,
  { name, isPublic }: { name?: string; isPublic?: boolean }
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserEditMutationVariables>({
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
