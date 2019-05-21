import { gql } from 'graphql.macro';
import { WrRoomDetail, WrRoom } from './types';
import { WrRoomMessage } from '../room-message/types';

export const IN_ROOMS_QUERY = gql`
query InRooms {
  rwInRooms {
    id
    deck {
      id
      name
      nameLang
      owner {
        id
        email
        roles
      }
    }
  }
}
`;

export type InRoomsVariables = object;

export interface InRoomsData {
  rwInRooms: WrRoom[] | null;
}

export const ROOM_DETAIL_QUERY = gql`
query Room(
  $id: ID!
) {
  rwRoom(id: $id) {
    id
    owner {
      id
      email
      roles
    }
    occupants {
      id
      email
      roles
    }
    deck {
      id
      name
      nameLang
      owner {
        id
        email
        roles
      }
    }
    messages {
      id
      sender {
        id
        email
        roles
      }
      content
      contentType
    }
  }
}
`;

export interface RoomDetailVariables {
  readonly id: string;
}

export interface RoomDetailData {
  readonly rwRoom: WrRoomDetail | null;
}

// RoomCreate mutation

export const ROOM_CREATE_MUTATION = gql`
mutation RoomCreate(
  $deckId: ID!
) {
  rwRoomCreate(
    deckId: $deckId
  ) {
    id
  }
}
`;

export interface RoomCreateVariables {
  readonly deckId: string;
}

export interface RoomCreateData {
  readonly rwRoomCreate: { id: string } | null;
}

// RoomMessageCreate mutation

export const ROOM_MESSAGE_CREATE_MUTATION = gql`
mutation RoomMessageCreate(
  $roomId: ID!
  $content: String!
) {
  rwRoomMessageCreate(
    roomId: $roomId
    content: $content
  ) {
    id
    sender {
      id
      email
      roles
    }
    content
    contentType
  }
}
`;

export interface RoomMessageCreateVariables {
  readonly roomId: string;
  readonly content: string;
}

export interface RoomMessageCreateData {
  readonly rwRoomMessageCreate: WrRoomMessage | null;
}
