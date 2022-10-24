import { WrServer } from "../../../src/graphqlApp";
import { gql, testQuery } from "../misc";
import { RoomAddOccupantMutationVariables, RoomQueryVariables, RoomSetDeckMutationVariables, RoomSetStateMutationVariables } from "../../../generated/typescript-operations";

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

export function mutationRoomAddOccupant(server: WrServer, variables: RoomAddOccupantMutationVariables) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<RoomAddOccupantMutationVariables>({
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

export function queryOccupyingRooms(server: WrServer) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<undefined>({
    server,
    document: gql`
      query OccupyingRooms{
        occupyingRooms {
          id
          state
          ownerId
        }
      }
    `,
    variables: undefined,
  });
}
