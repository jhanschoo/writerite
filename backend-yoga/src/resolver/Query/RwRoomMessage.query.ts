import { IFieldResolver } from 'graphql-tools';

import { IRwContext } from '../../types';

import { IBakedRwRoomMessage, pRoomMessageToRwRoomMessage } from '../RwRoomMessage';
import { throwIfDevel, wrGuardPrismaNullError } from '../../util';

const rwRoomMessage: IFieldResolver<any, IRwContext, { id: string }> = async (
  _parent, { id }, { prisma },
): Promise<IBakedRwRoomMessage | null> => {
  try {
    const pRoomMessage = await prisma.pRoomMessage({ id });
    wrGuardPrismaNullError(pRoomMessage);
    return pRoomMessageToRwRoomMessage(pRoomMessage, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwRoomMessagesOfRoom: IFieldResolver<any, IRwContext, { roomId: string }> = async (
  _parent, { roomId }, { prisma, sub },
): Promise<IBakedRwRoomMessage[] | null> => {
  try {
    const pRoomMessages = await prisma.pRoomMessages({
      where: {
        room: { id: roomId },
      },
      orderBy: 'createdAt_ASC',
    });
    wrGuardPrismaNullError(pRoomMessages);
    return pRoomMessages.map((pRoomMessage) => pRoomMessageToRwRoomMessage(pRoomMessage, prisma));
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwRoomMessageQuery = {
  rwRoomMessage, rwRoomMessagesOfRoom,
};
