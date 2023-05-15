import { buildHTTPExecutor } from '@graphql-tools/executor-http';

import { graphql } from '../../generated/gql';
import {
  RoomArchiveMutationVariables,
  RoomEndRoundMutationVariables,
  RoomJoinMutationVariables,
  RoomQueryVariables,
  RoomSetDeckMutationVariables,
  RoomStartRoundMutationVariables,
  RoomUpdatesByRoomIdSubscriptionVariables,
} from '../../generated/gql/graphql';
import { testQuery, testSubscription } from '../misc';

export function mutationRoomCreate(
  executor: ReturnType<typeof buildHTTPExecutor>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation RoomCreate {
        roomCreate {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables: {},
  });
}

export function mutationRoomSetDeck(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomSetDeckMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation RoomSetDeck($id: ID!, $deckId: ID!) {
        roomSetDeck(id: $id, deckId: $deckId) {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables,
  });
}

export function mutationRoomStartRound(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomStartRoundMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation RoomStartRound($id: ID!) {
        roomStartRound(id: $id) {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables,
  });
}

export function mutationRoomEndRound(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomEndRoundMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation RoomEndRound($id: ID!) {
        roomEndRound(id: $id) {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables,
  });
}

export function mutationRoomArchive(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomArchiveMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation RoomArchive($id: ID!) {
        roomArchive(id: $id) {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables,
  });
}

export function mutationRoomJoin(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomJoinMutationVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      mutation RoomJoin($id: ID!) {
        roomJoin(id: $id) {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables,
  });
}

export function queryRoom(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomQueryVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      query Room($id: ID!) {
        room(id: $id) {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables,
  });
}

export function queryOccupyingUnarchivedEphemeralRooms(
  executor: ReturnType<typeof buildHTTPExecutor>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery({
    executor,
    document: graphql(/* GraphQL */ `
      query OccupyingUnarchivedEphemeralRooms {
        occupyingUnarchivedEphemeralRooms {
          id
          type
          activeRound {
            id
            deck {
              id
            }
            isActive
            state
            slug
          }
          occupants {
            id
          }
        }
      }
    `),
    variables: {},
  });
}

export function subscriptionRoomUpdatesByRoomId(
  executor: ReturnType<typeof buildHTTPExecutor>,
  variables: RoomUpdatesByRoomIdSubscriptionVariables
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription({
    executor,
    document: graphql(/* GraphQL */ `
      subscription RoomUpdatesByRoomId($id: ID!) {
        roomUpdatesByRoomId(id: $id) {
          operation
          value {
            id
            type
            activeRound {
              id
              deck {
                id
              }
              isActive
              state
              slug
            }
            occupants {
              id
            }
          }
        }
      }
    `),
    variables,
  });
}
