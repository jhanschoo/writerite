import { graphql } from "../../../generated/gql";
import {
  MessageUpdatesByRoomIdSubscriptionVariables,
  SendTextMessageMutationVariables,
} from "../../../generated/gql/graphql";
import { testQuery, testSubscription } from "../misc";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

export function mutationSendTextMessage(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: SendTextMessageMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(`
      mutation SendTextMessage($roomId: ID!, $textContent: String!) {
        sendTextMessage(roomId: $roomId, textContent: $textContent) {
          content
          createdAt
          id
          sender {
            id
          }
          type
        }
      }
    `),
    variables,
  });
}
// SubscriptionMessageUpdatesByRoomSlugArgs
export function subscriptionMessageUpdatesByRoomId(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: MessageUpdatesByRoomIdSubscriptionVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription({
    executor,
    document: graphql(/* GraphQL */ `
      subscription MessageUpdatesByRoomId($id: ID!) {
        messageUpdatesByRoomId(id: $id) {
          operation
          value {
            content
            createdAt
            id
            sender {
              id
            }
            type
          }
        }
      }
    `),
    variables,
  });
}
