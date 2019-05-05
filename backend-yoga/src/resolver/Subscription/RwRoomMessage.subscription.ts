import { IFieldResolver } from 'graphql-tools';

import { IUpdate, IRwContext } from '../../types';

import { pRoomMessageToRwRoomMessage } from '../RwRoomMessage';
import { PRoomMessage } from '../../../generated/prisma-client';
import { updateMapFactory, throwIfDevel, wrNotFoundError } from '../../util';

export function rwRoomMessagesTopicFromRwRoom(id: string) {
  return `room-message:room:${id}`;
}

const rwRoomMessagesUpdatesOfRoomSubscribe: IFieldResolver<any, IRwContext, {
  roomId: string,
}> = async (
  _parent, { roomId }, { prisma, pubsub },
): Promise<AsyncIterator<IUpdate<PRoomMessage>> | null> => {
  try {
    if (!await prisma.$exists.pRoom({ id: roomId })) {
      throw wrNotFoundError('room');
    }
    return pubsub.asyncIterator<IUpdate<PRoomMessage>>(
      rwRoomMessagesTopicFromRwRoom(roomId),
    );
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwRoomMessageSubscription = {
  rwRoomMessagesUpdatesOfRoom: {
    resolve: updateMapFactory(pRoomMessageToRwRoomMessage),
    subscribe: rwRoomMessagesUpdatesOfRoomSubscribe,
  },
};
