import moment from 'moment';

import { PRoom, Prisma } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwDeck, RwDeck } from './RwDeck';
import { IRwRoomMessage, RwRoomMessage } from './RwRoomMessage';
import { IRwUser, RwUser } from './RwUser';

// All fields in config should be optional for safety
export interface IRoomConfig {
  deckId?: string;
}

export interface ISRoom {
  id: string;
  active: boolean;
  config: string;
}

export interface IRwRoom extends ISRoom {
  owner: AFunResTo<IRwUser>;
  occupants: AFunResTo<IRwUser[]>;
  messages: AFunResTo<IRwRoomMessage[]>;
}

export interface IRwRoomHasOccupantParams {
  id: string;
  occupantId: string;
}

export interface IRwRoomCreateParams {
  userId: string;
  config: string;
}

export interface IRwRoomAddOccupantParams {
  id: string;
  occupantId: string;
}

export interface IRwRoomDeactivateParams {
  id: string;
}

// tslint:disable-next-line: variable-name
export const SRoom = {
  fromPRoom: (pRoom: PRoom): ISRoom => ({
    ...pRoom,
    active: !pRoom.inactiveOverride && moment.utc(
      pRoom.lastKnownActiveMessage,
    ).isSameOrAfter(moment().subtract(1, 'days')),
  }),
  get: async (prisma: Prisma, id: string): Promise<ISRoom | null> => {
    const pRoom = await prisma.pRoom({ id });
    return pRoom && SRoom.fromPRoom(pRoom);
  },
  getFromOccupantOrOwnerId: async (prisma: Prisma, userId: string): Promise<ISRoom[] | null> => {
    if (!await prisma.$exists.pUser({ id: userId })) {
      return null;
    }
    const pRooms = await prisma.pRooms({
      where: {
        OR: [{
          owner: { id: userId },
        }, {
          occupants_some: { id: userId },
        }],
      },
      orderBy: 'createdAt_DESC',
    });
    return pRooms.map(SRoom.fromPRoom);
  },
  hasOccupant: async (prisma: Prisma, {
    id, occupantId,
  }: IRwRoomHasOccupantParams) => {
    return await prisma.$exists.pRoom({
      id,
      OR: [{
        owner: { id: occupantId },
      }, {
        occupants_some: { id: occupantId },
      }],
    });
  },
  create: async (prisma: Prisma, {
    userId, config,
  }: IRwRoomCreateParams): Promise<ISRoom> => {
    return await SRoom.fromPRoom(await prisma.createPRoom({
      owner: { connect: { id: userId } },
      lastKnownActiveMessage: moment().toDate(),
      inactiveOverride: false,
      config,
    }));
  },
  addOccupant: async (prisma: Prisma, {
    id, occupantId,
  }: IRwRoomAddOccupantParams): Promise<ISRoom | null> => {
    const pRooms = await prisma.pRooms({
      where: {
        id,
        OR: [{
          owner: { id: occupantId },
        }, {
          occupants_some: { id: occupantId },
        }],
      },
    });
    if (pRooms.length === 1) {
      return SRoom.fromPRoom(pRooms[0]);
    }
    return SRoom.fromPRoom(await prisma.updatePRoom({
      data: {
        occupants: { connect: { id: occupantId } },
      },
      where: { id },
    }));
  },
  deactivate: async (prisma: Prisma, {
    id,
  }: IRwRoomDeactivateParams): Promise<ISRoom> => {
    return SRoom.fromPRoom(await prisma.updatePRoom({
      data: { inactiveOverride: true },
      where: { id },
    }));
  },
};

// tslint:disable-next-line: variable-name
export const RwRoom = {
  fromSRoom: (prisma: Prisma, sRoom: ISRoom): IRwRoom => ({
    ...sRoom,
    owner: async () => {
      const pUsers = await prisma.pUsers({ where: { ownerOfRoom_some: { id: sRoom.id } } });
      return RwUser.fromPUser(prisma, pUsers[0]);
    },
    occupants: async () => {
      const pUsers = await prisma.pUsers({ where: { occupyingRoom_some: { id: sRoom.id } } });
      return pUsers.map((pUser) => RwUser.fromPUser(prisma, pUser));
    },
    messages: async () => {
      const pRoomMessages = await prisma.pRoomMessages({
        where: { room: { id: sRoom.id } },
      });
      return pRoomMessages.map(
        (pRoomMessage) => RwRoomMessage.fromPRoomMessage(prisma, pRoomMessage),
      );
    },
  }),
  fromPRoom: (prisma: Prisma, pRoom: PRoom) => RwRoom.fromSRoom(
    prisma, SRoom.fromPRoom(pRoom),
  ),
  get: async (prisma: Prisma, id: string): Promise<IRwRoom | null> => {
    const sRoom = await SRoom.get(prisma, id);
    return sRoom && RwRoom.fromSRoom(prisma, sRoom);
  },
  getFromOccupantOrOwnerId: async (prisma: Prisma, userId: string): Promise<IRwRoom[] | null> => {
    const sRooms = await SRoom.getFromOccupantOrOwnerId(prisma, userId);
    return sRooms && sRooms.map((sRoom) => RwRoom.fromSRoom(prisma, sRoom));
  },
  hasOccupant: SRoom.hasOccupant,
  create: async (prisma: Prisma, params: IRwRoomCreateParams) =>
    RwRoom.fromSRoom(prisma, await SRoom.create(prisma, params)),
  addOccupant: async (
    prisma: Prisma, params: IRwRoomAddOccupantParams,
  ): Promise<IRwRoom | null> => {
    const sRoom = await SRoom.addOccupant(prisma, params);
    return sRoom && RwRoom.fromSRoom(prisma, sRoom);
  },
  deactivate: async (
    prisma: Prisma, params: IRwRoomDeactivateParams,
  ): Promise<IRwRoom> => {
    const sRoom = await SRoom.deactivate(prisma, params);
    return RwRoom.fromSRoom(prisma, sRoom);
  },
};

// type assertions

const _SRoom: IModel<ISRoom> = SRoom;
const _RwRoom: IModel<IRwRoom> = RwRoom;
