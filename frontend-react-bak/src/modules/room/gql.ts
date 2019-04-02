import gql from 'graphql-tag';
import {
  WrRoomDetail, WrRoom, WrRoomUpdatesPayload,
} from './types';

// Room query

export const ROOM_QUERY = gql`
query Room($roomId: ID!) {
  rwRoom(id: $roomId) {
    id
    name
    owner {
      id
      email
    }
    occupants {
      id
      email
    }
    servingDeck {
      id
      name
      owner {
        id
        email
      }
    }
  }
}
`;

export interface RoomVariables {
  readonly roomId: string;
}

export interface RoomData {
  readonly rwRoom: WrRoomDetail | null;
}

// Rooms query

export const ROOMS_QUERY = gql`
query Rooms {
  rwRooms {
    id
    name
    owner {
      id
      email
    }
  }
}
`;

export type RoomsVariables = object;

export interface RoomsData {
  readonly rwRooms: WrRoom[] | null;
}

// RoomCreate mutation

export const ROOM_CREATE_MUTATION = gql`
mutation RoomCreate($name: String) {
  rwRoomCreate(name: $name) {
    id
    name
  }
}
`;

export interface RoomCreateVariables {
  readonly name?: string;
}

export interface RoomCreateData {
  readonly rwRoomCreate: WrRoom | null;
}

// RoomServeDeck mutation

export const ROOM_SERVE_DECK = gql`
mutation RoomServeDeck($id: ID! $deckId: ID) {
  rwRoomServeDeck(id: $id deckId: $deckId) {
    id
    name
    owner {
      id
      email
    }
  }
}
`;

export interface RoomServeDeckVariables {
  readonly id: string;
  readonly deckId?: string;
}

export interface RoomServeDeckData {
  readonly rwRoomServeDeck: WrRoom | null;
}

// RoomUpdatesSubscription

export const ROOM_UPDATES_SUBSCRIPTION = gql`
subscription RoomUpdates {
  rwRoomUpdates {
    mutation
    new {
      id
      name
      owner {
        id
        email
      }
    }
    oldId
  }
}
`;

export type RoomUpdatesVariables = object;

export interface RoomUpdatesData {
  readonly rwRoomUpdates: WrRoomUpdatesPayload;
}
