import { IFieldResolver } from 'graphql-tools';

import { IRwContext } from '../../types';

import { IBakedRwRoom, pRoomToRwRoom } from '../RwRoom';
import { throwIfDevel, wrGuardPrismaNullError } from '../../util';

const rwRoom: IFieldResolver<any, IRwContext, { id: string }> = async (
  _parent, { id }, { prisma },
): Promise<IBakedRwRoom | null> => {
  try {
    const pRoom = wrGuardPrismaNullError(await prisma.pRoom({ id }));
    return pRoomToRwRoom(pRoom, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

// TODO: restrict retrieved rooms to only owned rooms or member of rooms
const rwInRooms: IFieldResolver<any, IRwContext, {}> = async (
  _parent, _args, { prisma },
): Promise<IBakedRwRoom[] | null> => {
  try {
    const pRooms = await prisma.pRooms();
    wrGuardPrismaNullError(pRooms);
    return pRooms.map((pRoom) => pRoomToRwRoom(pRoom, prisma));
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwRoomQuery = {
  rwRoom, rwInRooms,
};
