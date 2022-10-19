import { WrServer } from "../../../src/graphqlServer";
import { gql, inject } from "../misc";
import { OccupyingRoomsQuery, RoomAddOccupantMutation, RoomAddOccupantMutationVariables, RoomCreateMutation, RoomQuery, RoomQueryVariables, RoomSetDeckMutation, RoomSetDeckMutationVariables, RoomSetStateMutation, RoomSetStateMutationVariables } from "../../../generated/typescript-operations";

export async function mutationRoomCreate(server: WrServer) {
  return inject<RoomCreateMutation, undefined>({
    server,
    document: gql`
      mutation RoomCreate {
        roomCreate {
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
    variables: undefined,
  });
}

export async function mutationRoomSetDeck(server: WrServer, variables: RoomSetDeckMutationVariables) {
  return inject<RoomSetDeckMutation, RoomSetDeckMutationVariables>({
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

export async function mutationRoomAddOccupant(server: WrServer, variables: RoomAddOccupantMutationVariables) {
  return inject<RoomAddOccupantMutation, RoomAddOccupantMutationVariables>({
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

export async function mutationRoomSetState(server: WrServer, variables: RoomSetStateMutationVariables) {
  return inject<RoomSetStateMutation, RoomSetStateMutationVariables>({
    server,
    document: gql`
      mutation RoomSetState($id: ID!, $state: RoomState!) {
        roomSetState(id: $id, state: $state) {
          id
          state
          deckId
        }
      }
    `,
    variables,
  });
}

export async function queryRoom(server: WrServer, id: string) {
  return inject<RoomQuery, RoomQueryVariables>({
    server,
    document: gql`
      query Room($id: ID!) {
        room(id: $id) {
          id
          state
          deckId
        }
      }
    `,
    variables: { id },
  });
}

export function queryOccupyingRooms(server: WrServer) {
  return inject<OccupyingRoomsQuery, undefined>({
    server,
    document: gql`
      query OccupyingRooms{
        occupyingRooms {
          id
          state
          deckId
        }
      }
    `,
    variables: undefined,
  });
}
