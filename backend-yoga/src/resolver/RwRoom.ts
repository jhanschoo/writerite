import { PRoom, Prisma, PUser, PRoomMessage } from '../../generated/prisma-client';
import { ResTo, AFunResTo } from '../types';
import { IRwUser, IBakedRwUser, pUserToRwUser } from './RwUser';
import {
  IRwRoomMessage, IBakedRwRoomMessage, pRoomMessageToRwRoomMessage,
} from './RwRoomMessage';
import { fieldGetter, wrGuardPrismaNullError } from '../util';
import { IRwDeck, IBakedRwDeck, pDeckToRwDeck } from './RwDeck';

export interface IRwRoom {
  id: ResTo<string>;
  owner: ResTo<IRwUser>;
  occupants: ResTo<IRwUser[]>;
  deck: ResTo<IRwDeck | null>;
  messages: ResTo<IRwRoomMessage[]>;
}

// tslint:disable-next-line: variable-name
export const RwRoom = {
  id: fieldGetter('id'),
  owner: fieldGetter('owner'),
  occupants: fieldGetter('occupants'),
  deck: fieldGetter('deck'),
  messages: fieldGetter('messages'),
};

export interface IBakedRwRoom extends IRwRoom {
  id: string;
  owner: AFunResTo<IBakedRwUser>;
  occupants: AFunResTo<IBakedRwUser[]>;
  deck: AFunResTo<IBakedRwDeck | null>;
  messages: AFunResTo<IBakedRwRoomMessage[]>;
}

export function pRoomToRwRoom(pRoom: PRoom, prisma: Prisma): IBakedRwRoom {
  return {
    id: pRoom.id,
    owner: async () => pUserToRwUser(
      wrGuardPrismaNullError(await prisma.pRoom({ id: pRoom.id }).owner()),
      prisma,
    ),
    occupants: async () => wrGuardPrismaNullError<PUser[]>(
      await prisma.pRoom({ id: pRoom.id }).occupants(),
    ).map((pUser) => pUserToRwUser(pUser, prisma)),
    deck: async () => {
      const pDeck = await prisma.pRoom({ id: pRoom.id }).deck();
      return pDeck ? pDeckToRwDeck(pDeck, prisma) : null;
    },
    messages: async () => wrGuardPrismaNullError<PRoomMessage[]>(
      await prisma.pRoom({ id: pRoom.id }).messages(),
    ).map((pRoomMessage) => pRoomMessageToRwRoomMessage(pRoomMessage, prisma)),
  };
}
