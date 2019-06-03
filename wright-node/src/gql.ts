import gql from 'graphql-tag';
import { IRwCard } from './types';

export const ROOM_INFO_QUERY = gql`
query RoomInfo($roomId: ID!) {
  rwRoom(id: $roomId) {
    id
    name
    servingDeck {
      id
      name
      cards {
        id
        front
        back
      }
    }
  }
}
`;

export interface IRoomInfoVariables {
  roomId: string;
}

export interface IRoomInfoData {
  rwRoom: null | {
    id: string;
    name: string;
    servingDeck: {
      id: string;
      name: string;
      cards: IRwCard[];
    }
  };
}

export const MESSAGE_CREATE_MUTATION = gql`
mutation MessageCreate($roomId: ID! $content: String!) {
  rwRoomMessageCreate(roomId: $roomId content: $content) {
    id
    content
  }
}
`;

export interface IMessageCreateVariables {
  roomId: string;
  content: string;
}

export interface IMessageCreateData {
  rwRoomMessageCreate: {
    id: string,
    content: string,
  };
}
