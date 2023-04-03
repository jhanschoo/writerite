import { gql, testQuery } from "../misc";
import { RoomInvitationSendMutationVariables } from "../../../generated/typescript-operations";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

export function mutationRoomInvitationSendSubdeck(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomInvitationSendMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomInvitationSendMutationVariables>({
    executor,
    document: gql`
      mutation RoomInvitationSend($receiverId: ID!, $roomId: ID!) {
        roomInvitationSend(receiverId: $receiverId, roomId: $roomId) {
          id
        }
      }
    `,
    variables,
  });
}
