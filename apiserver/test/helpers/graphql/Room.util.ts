import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery, testSubscription } from '../misc';
import {
  RoomJoinMutationVariables,
  RoomQueryVariables,
  RoomSetDeckMutationVariables,
  RoomSetStateMutationVariables,
  RoomUpdatesByRoomSlugSubscriptionVariables,
} from '../../../generated/typescript-operations';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';

export function mutationRoomCreate(executor: ReturnType<typeof buildHTTPExecutor>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    executor,
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

export function mutationRoomSetDeck(executor: ReturnType<typeof buildHTTPExecutor>, variables: RoomSetDeckMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomSetDeckMutationVariables>({
    executor,
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

export function mutationRoomSetState(executor: ReturnType<typeof buildHTTPExecutor>, variables: RoomSetStateMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomSetStateMutationVariables>({
    executor,
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

export function mutationRoomJoin(executor: ReturnType<typeof buildHTTPExecutor>, variables: RoomJoinMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomJoinMutationVariables>({
    executor,
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

export function queryRoom(executor: ReturnType<typeof buildHTTPExecutor>, id: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomQueryVariables>({
    executor,
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

export function queryOccupyingActiveRooms(executor: ReturnType<typeof buildHTTPExecutor>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    executor,
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

export function subscriptionRoomUpdatesByRoomSlug(executor: ReturnType<typeof buildHTTPExecutor>, slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription<RoomUpdatesByRoomSlugSubscriptionVariables>({
    executor,
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
