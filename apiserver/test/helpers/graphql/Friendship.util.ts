import { gql, testQuery } from "../misc";
import { UserBefriendUserMutationVariables } from "../../../generated/typescript-operations";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

export function mutationUserBefriendUser(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: UserBefriendUserMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<UserBefriendUserMutationVariables>({
    executor,
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
