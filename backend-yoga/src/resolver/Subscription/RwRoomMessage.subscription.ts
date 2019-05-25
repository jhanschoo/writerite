import { IFieldResolver } from 'apollo-server-koa';

import { IUpdate, IContext } from '../../types';

import { updateMapFactory } from '../../util';
import { ISRoomMessage, RwRoomMessage } from '../../model/RwRoomMessage';

export function rwRoomMessagesTopicFromRwRoom(id: string) {
  return `room-message:room:${id}`;
}

const rwRoomMessagesUpdatesOfRoomSubscribe: IFieldResolver<any, IContext, {
  roomId: string,
}> = async (
  _parent, { roomId }, { prisma, pubsub },
): Promise<AsyncIterator<IUpdate<ISRoomMessage>> | null> => {
  if (!await prisma.$exists.pRoom({ id: roomId })) {
    return null;
  }
  return pubsub.asyncIterator<IUpdate<ISRoomMessage>>(
    rwRoomMessagesTopicFromRwRoom(roomId),
  );
};

export const rwRoomMessageSubscription = {
  rwRoomMessagesUpdatesOfRoom: {
    resolve: updateMapFactory(RwRoomMessage.fromSRoomMessage),
    subscribe: rwRoomMessagesUpdatesOfRoomSubscribe,
  },
};
