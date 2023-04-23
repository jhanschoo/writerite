import { buildHTTPExecutor } from '@graphql-tools/executor-http';

import { graphql } from '../../generated/gql';
import { BefriendMutationVariables } from '../../generated/gql/graphql';
import { testQuery } from '../misc';

export function mutationUserBefriendUser(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: BefriendMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation Befriend($befriendedId: ID!) {
        befriend(befriendedId: $befriendedId) {
          id
        }
      }
    `),
    variables,
  });
}
