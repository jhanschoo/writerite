import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery, testSubscription } from '../misc';
import {
  RoomJoinMutationVariables,
  RoomQueryVariables,
  RoomSetDeckMutationVariables,
  RoomSetStateMutationVariables,
  RoomUpdatesByRoomSlugSubscriptionVariables,
} from '../../../generated/typescript-operations';

export function mutationRoomCreate(server: WrServer) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    server,
    document: gql`
      mutation RoomCreate {
        roomCreate {
          id
          slug
          ownerId
          state
          deckId
          deck {
            id
          }
          occupants {
            id
          }
        }
      }
    `,
    variables: undefined,
  });
}

export function mutationRoomSetDeck(server: WrServer, variables: RoomSetDeckMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomSetDeckMutationVariables>({
    server,
    document: gql`
      mutation RoomSetDeck($id: ID!, $deckId: ID!) {
        roomSetDeck(id: $id, deckId: $deckId) {
          id
          ownerId
          state
          deckId
          deck {
            id
          }
        }
      }
    `,
    variables,
  });
}

export function mutationRoomSetState(server: WrServer, variables: RoomSetStateMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomSetStateMutationVariables>({
    server,
    document: gql`
      mutation RoomSetState($id: ID!, $state: RoomState!) {
        roomSetState(id: $id, state: $state) {
          id
          ownerId
          state
          deckId
          deck {
            id
          }
        }
      }
    `,
    variables,
  });
}

export function mutationRoomJoin(server: WrServer, variables: RoomJoinMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomJoinMutationVariables>({
    server,
    document: gql`
      mutation RoomJoin($id: ID!) {
        roomJoin(id: $id) {
          id
          ownerId
          state
          deckId
          deck {
            id
          }
          occupants {
            id
          }
        }
      }
    `,
    variables,
  });
}

export function queryRoom(server: WrServer, id: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomQueryVariables>({
    server,
    document: gql`
      query Room($id: ID!) {
        room(id: $id) {
          id
          state
          ownerId
        }
      }
    `,
    variables: { id },
  });
}

export function queryOccupyingActiveRooms(server: WrServer) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    server,
    document: gql`
      query OccupyingActiveRooms {
        occupyingActiveRooms {
          id
          state
          ownerId
        }
      }
    `,
    variables: undefined,
  });
}

export function subscriptionRoomUpdatesByRoomSlug(server: WrServer, slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription<RoomUpdatesByRoomSlugSubscriptionVariables>({
    server,
    document: gql`
      subscription RoomUpdatesByRoomSlug($slug: String!) {
        roomUpdatesByRoomSlug(slug: $slug) {
          operation
          value {
            id
            deckId
            deck {
              id
            }
            userIdOfLastAddedOccupantForSubscription
            userOfLastAddedOccupantForSubscription {
              id
            }
            state
          }
        }
      }
    `,
    variables: { slug },
  });
}
