import gql from 'graphql-tag';
import {
  WrRoomMessage, WrRoomMessageUpdatesPayload,
} from './types';

// RoomMessages query

export const ROOM_MESSAGES_QUERY = gql`
query RoomMessages($roomId: ID!) {
  rwRoomMessagesOfRoom(roomId: $roomId) {
    id
    content
    sender {
      id
      email
    }
  }
}
`;

export interface RoomMessagesVariables {
  readonly roomId: string;
}

export interface RoomMessagesData {
  readonly rwRoomMessagesOfRoom: WrRoomMessage[] | null;
}

// RoomMessageCreate mutation

export const ROOM_MESSAGE_CREATE = gql`
mutation RoomMessageCreate($roomId: ID! $content: String!) {
  rwRoomMessageCreate(roomId: $roomId content: $content) {
    id
    content
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

// RoomMessageUpdates subscription

export const ROOM_MESSAGE_UPDATES_SUBSCRIPTION = gql`
subscription RoomMessageUpdates($roomId: ID!) {
  rwRoomMessageUpdatesOfRoom(roomId: $roomId) {
    mutation
    new {
      id
      content
      sender {
        id
        email
      }
    }
  }
}
`;

export interface RoomMessageUpdatesVariables {
  readonly roomId: string;
}

export interface RoomMessageUpdatesData {
  readonly rwRoomMessageUpdatesOfRoom: WrRoomMessageUpdatesPayload;
}
