import { IFieldResolver } from 'apollo-server-koa';

import { IContext } from '../../types';
import { IRwRoomMessage } from '../../model/RwRoomMessage';

const rwRoomMessage: IFieldResolver<any, IContext, { id: string }> = async (
  _parent, { id }, { models, prisma },
): Promise<IRwRoomMessage | null> => {
  return models.RwRoomMessage.get(prisma, id);
};

const rwRoomMessagesOfRoom: IFieldResolver<any, IContext, { roomId: string }> = async (
  _parent, { roomId }, { models, prisma },
): Promise<IRwRoomMessage[] | null> => {
  return models.RwRoomMessage.getFromRoomId(prisma, roomId);
};

export const rwRoomMessageQuery = {
  rwRoomMessage, rwRoomMessagesOfRoom,
};
