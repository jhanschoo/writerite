import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery } from '../misc';
import { RoomInvitationSendMutationVariables } from '../../../generated/typescript-operations';

export function mutationRoomInvitationSendSubdeck(
  server: WrServer,
  variables: RoomInvitationSendMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomInvitationSendMutationVariables>({
    server,
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
