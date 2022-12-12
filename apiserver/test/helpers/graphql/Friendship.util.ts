import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery } from '../misc';
import { UserBefriendUserMutationVariables } from '../../../generated/typescript-operations';

export function mutationUserBefriendUser(
  server: WrServer,
  variables: UserBefriendUserMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserBefriendUserMutationVariables>({
    server,
    document: gql`
      mutation UserBefriendUser($befriendedId: ID!) {
        userBefriendUser(befriendedId: $befriendedId) {
          id
        }
      }
    `,
    variables,
  });
}
