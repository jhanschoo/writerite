import { IFieldResolver } from 'apollo-server-koa';

import { IContext } from '../../types';
import { IRwRoom } from '../../model/RwRoom';

const rwRoom: IFieldResolver<any, IContext, { id: string }> = async (
  _parent, { id }, { models, prisma },
): Promise<IRwRoom | null> => {
  return models.RwRoom.get(prisma, id);
};

const rwInRooms: IFieldResolver<any, IContext, any> = async (
  _parent, _args, { models, prisma, sub },
): Promise<IRwRoom[] | null> => {
  if (!sub) {
    return null;
  }
  return models.RwRoom.getFromOccupantOrOwnerId(prisma, sub.id);
};

export const rwRoomQuery = {
  rwRoom, rwInRooms,
};
