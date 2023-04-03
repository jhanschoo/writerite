import { gql, testQuery } from "../misc";
import {
  CreateUserMutationVariables,
  NameUserMutationVariables,
  RefreshMutationVariables,
  UserAccessibleUserScalarsQueryVariables,
  UserEditMutationVariables,
  UserPublicScalarsQueryVariables,
} from "../../../generated/typescript-operations";
import { CurrentUser } from "../../../src/service/userJWT";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

export const DEFAULT_CREATE_USER_VALUES = {
  name: "abcxyz",
};

export function mutationCreateUser(
  executor: ReturnType<typeof buildHTTPExecutor>,
  { name }: { name: string } = DEFAULT_CREATE_USER_VALUES
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<CreateUserMutationVariables>({
    executor,
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
        ) {
          currentUser
          token
        }
      }
    `,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    variables: {
      code: name,
      nonce: "",
      provider: "development",
      redirect_uri: "",
    },
  });
}

export function mutationNameUser(
  executor: ReturnType<typeof buildHTTPExecutor>,
  { name }: { name: string } = DEFAULT_CREATE_USER_VALUES
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<NameUserMutationVariables>({
    executor,
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
  executor: ReturnType<typeof buildHTTPExecutor>,
  setSub: (sub?: CurrentUser) => void,
  name?: string
): Promise<{ currentUser: CurrentUser; token: string }> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await (name
    ? mutationCreateUser(executor, { name })
    : mutationCreateUser(executor));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const sessionInfo = response.data.finalizeOauthSignin as {
    currentUser: CurrentUser;
    token: string;
  };
  setSub(sessionInfo.currentUser);
  return sessionInfo;
}

export async function refreshLogin(
  executor: ReturnType<typeof buildHTTPExecutor>,
  setSub: (sub?: CurrentUser) => void,
  token: string
): Promise<{ currentUser: CurrentUser; token: string }> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await mutationRefresh(executor, token);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const sessionInfo = response.data.refresh as {
    currentUser: CurrentUser;
    token: string;
  };
  setSub(sessionInfo.currentUser);
  return sessionInfo;
}

export async function mutationRefresh(
  executor: ReturnType<typeof buildHTTPExecutor>,
  token: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RefreshMutationVariables>({
    executor,
    document: gql`
      mutation Refresh($token: JWT!) {
        refresh(token: $token) {
          currentUser
          token
        }
      }
    `,
    variables: { token },
  });
}

export function queryAllUserAccessibleUserScalars(
  executor: ReturnType<typeof buildHTTPExecutor>,
  id: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserAccessibleUserScalarsQueryVariables>({
    executor,
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

export function queryUserPublicScalars(
  executor: ReturnType<typeof buildHTTPExecutor>,
  id: string
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserPublicScalarsQueryVariables>({
    executor,
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
  executor: ReturnType<typeof buildHTTPExecutor>,
  { name, isPublic }: { name?: string; isPublic?: boolean }
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserEditMutationVariables>({
    executor,
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
