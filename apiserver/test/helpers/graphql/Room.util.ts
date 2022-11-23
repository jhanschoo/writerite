import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery, testSubscription } from '../misc';
import {
  MutationRoomAddOccupantArgs,
  MutationRoomSetDeckArgs,
  MutationRoomSetStateArgs,
  QueryRoomArgs,
  SubscriptionRoomUpdatesByRoomSlugArgs,
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

export function mutationRoomSetDeck(server: WrServer, variables: MutationRoomSetDeckArgs) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<MutationRoomSetDeckArgs>({
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

export function mutationRoomSetState(server: WrServer, variables: MutationRoomSetStateArgs) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<MutationRoomSetStateArgs>({
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

export function mutationRoomAddOccupant(
  server: WrServer,
  variables: MutationRoomAddOccupantArgs
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<MutationRoomAddOccupantArgs>({
    server,
    document: gql`
      mutation RoomAddOccupant($id: ID!, $occupantId: ID!) {
        roomAddOccupant(id: $id, occupantId: $occupantId) {
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
  return testQuery<QueryRoomArgs>({
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
  return testSubscription<SubscriptionRoomUpdatesByRoomSlugArgs>({
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
