import { IFieldResolver } from 'graphql-tools';

import { IRwContext } from '../../types';

import { IBakedRwRoom, pRoomToRwRoom } from '../RwRoom';
import { throwIfDevel, wrGuardPrismaNullError, wrAuthenticationError } from '../../util';

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

const rwInRooms: IFieldResolver<any, IRwContext, {}> = async (
  _parent, _args, { prisma, sub },
): Promise<IBakedRwRoom[] | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    const pRooms = await prisma.pRooms({
      where: {
        OR: [{
          owner: {
            id: sub.id,
          },
        }, {
          occupants_some: {
            id: sub.id,
          },
        }],
      },
    });
    wrGuardPrismaNullError(pRooms);
    return pRooms.map((pRoom) => pRoomToRwRoom(pRoom, prisma));
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwRoomQuery = {
  rwRoom, rwInRooms,
};
