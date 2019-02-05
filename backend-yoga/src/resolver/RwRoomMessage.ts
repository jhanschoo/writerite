import { IRwUser, IBakedRwUser, pUserToRwUser } from './RwUser';
import { ResTo, AFunResTo } from '../types';
import { PRoomMessage, Prisma } from '../../generated/prisma-client';
import { fieldGetter, wrGuardPrismaNullError } from '../util';

export interface IRwRoomMessage {
  id: ResTo<string>;
  content: ResTo<string>;
  sender: ResTo<IRwUser | null> | null;
}

// tslint:disable-next-line: variable-name
export const RwRoomMessage: IRwRoomMessage = {
  id: fieldGetter<string>('id'),
  content: fieldGetter<string>('content'),
  sender: fieldGetter<IRwUser | null>('sender'),
};

export interface IBakedRwRoomMessage extends IRwRoomMessage {
  id: string;
  content: string;
  sender: AFunResTo<IBakedRwUser | null>;
}

export function pRoomMessageToRwRoomMessage(
  pRoomMessage: PRoomMessage,
  prisma: Prisma,
): IBakedRwRoomMessage {
  return {
    id: pRoomMessage.id,
    content: pRoomMessage.content,
    sender: async () => {
      const pUsers = await prisma.pUsers({
        where: {
          sentMessages_some: { id: pRoomMessage.id },
        },
      });
      wrGuardPrismaNullError(pUsers);
      if (pUsers.length !== 1) {
        return null;
      }
      return pUserToRwUser(pUsers[0], prisma);
    },
  };
}
