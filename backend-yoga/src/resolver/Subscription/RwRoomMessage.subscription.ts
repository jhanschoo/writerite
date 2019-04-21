import { IFieldResolver } from 'graphql-tools';

import { IUpdate, IRwContext } from '../../types';

import { pRoomMessageToRwRoomMessage } from '../RwRoomMessage';
import { PRoomMessage } from '../../../generated/prisma-client';
import { updateMapFactory, throwIfDevel, wrNotFoundError } from '../../util';

export function rwRoomMessageTopicFromRwRoom(id: string) {
  return `room-message:room:${id}`;
}

const rwRoomMessageUpdatesOfRoomSubscribe: IFieldResolver<any, IRwContext, {
  roomId: string,
}> = async (
  _parent, { roomId }, { prisma, pubsub },
): Promise<AsyncIterator<IUpdate<PRoomMessage>> | null> => {
  try {
    if (!await prisma.$exists.pRoom({ id: roomId })) {
      throw wrNotFoundError('room');
    }
    return pubsub.asyncIterator<IUpdate<PRoomMessage>>(
      rwRoomMessageTopicFromRwRoom(roomId)
    );
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwRoomMessageSubscription = {
  rwRoomMessageUpdatesOfRoom: {
    resolve: updateMapFactory(pRoomMessageToRwRoomMessage),
    subscribe: rwRoomMessageUpdatesOfRoomSubscribe,
  },
};
