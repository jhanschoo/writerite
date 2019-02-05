import { client } from './apolloClient';
import {
  IRoomInfoData, IRoomInfoVariables, ROOM_INFO_QUERY,
  IMessageCreateData, IMessageCreateVariables, MESSAGE_CREATE_MUTATION,
} from './gql';
import AsyncLock from 'async-lock';

export const lock = new AsyncLock();

export const getRoomInfo = async (roomId: string) => {
  // fetch room info
  return client.query<IRoomInfoData, IRoomInfoVariables>({
    query: ROOM_INFO_QUERY,
    variables: {
      roomId,
    },
    fetchPolicy: 'network-only',
  });
};

export const sendMessageFactory = (roomId: string) => (content: string) => {
  return client.mutate<IMessageCreateData, IMessageCreateVariables>({
    mutation: MESSAGE_CREATE_MUTATION,
    variables: {
      roomId,
      content,
    },
  });
};
