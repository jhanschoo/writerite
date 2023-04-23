import { buildHTTPExecutor } from '@graphql-tools/executor-http';

import { CurrentUser } from '../../../src/service/userJWT';
import { graphql } from '../../generated/gql';
import {
  MeQueryVariables,
  UserEditMutationVariables,
} from '../../generated/gql/graphql';
import { testQuery } from '../misc';

export const DEFAULT_CREATE_USER_VALUES = {
  name: 'abcxyz',
};

export function mutationCreateUser(
  executor: ReturnType<typeof buildHTTPExecutor>,
  { name }: { name: string } = DEFAULT_CREATE_USER_VALUES
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation CreateUser($input: FinalizeOauthSigninMutationInput!) {
        finalizeOauthSignin(input: $input) {
          currentUser
          token
        }
      }
    `),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    variables: {
      input: {
        code: name,
        nonce: '',
        provider: 'development',
        redirect_uri: '',
      },
    },
  });
}

export function mutationNameUser(
  executor: ReturnType<typeof buildHTTPExecutor>,
  { name }: { name: string } = DEFAULT_CREATE_USER_VALUES
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation NameUser($input: OwnProfileEditMutationInput!) {
        ownProfileEdit(input: $input) {
          id
          name
        }
      }
    `),
    variables: { input: { name } },
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
  const sessionInfo = response.data?.finalizeOauthSignin as unknown as {
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
  const sessionInfo = response.data?.refresh as unknown as {
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
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation Refresh($token: JWT!) {
        refresh(token: $token) {
          currentUser
          token
        }
      }
    `),
    variables: { token },
  });
}

export function queryMe(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: MeQueryVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      query Me {
        me {
          isPublic
          name
          roles
        }
      }
    `),
    variables,
  });
}

export function mutationUserEdit(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: UserEditMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation UserEdit($input: OwnProfileEditMutationInput!) {
        ownProfileEdit(input: $input) {
          id
          name
        }
      }
    `),
    variables,
  });
}
