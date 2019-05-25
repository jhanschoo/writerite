import { PRoom, Prisma } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwDeck, RwDeck } from './RwDeck';
import { IRwRoomMessage, RwRoomMessage } from './RwRoomMessage';
import { IRwUser, RwUser } from './RwUser';

export interface ISRoom {
  id: string;
}

export interface IRwRoom extends ISRoom {
  id: string;
  owner: AFunResTo<IRwUser>;
  occupants: AFunResTo<IRwUser[]>;
  deck: AFunResTo<IRwDeck>;
  messages: AFunResTo<IRwRoomMessage[]>;
}

export interface IRwRoomHasOccupantParams {
  id: string;
  occupantId: string;
}

export interface IRwRoomCreateParams {
  userId: string;
  deckId: string;
}

export interface IRwRoomAddOccupantParams {
  id: string;
  occupantId: string;
}

// tslint:disable-next-line: variable-name
export const SRoom = {
  fromPRoom: (pRoom: PRoom): ISRoom => pRoom,
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
    userId, deckId,
  }: IRwRoomCreateParams): Promise<ISRoom> => {
    return await SRoom.fromPRoom(await prisma.createPRoom({
      deck: { connect: { id: deckId } },
      owner: { connect: { id: userId } },
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
};

// tslint:disable-next-line: variable-name
export const RwRoom = {
  fromSRoom: (prisma: Prisma, sRoom: ISRoom): IRwRoom => ({
    ...sRoom,
    owner: async () => RwUser.fromPUser(
      prisma,
      await prisma.pRoom({ id: sRoom.id }).owner(),
    ),
    occupants: async () => (
      await prisma.pRoom({ id: sRoom.id }).occupants()
    ).map((pUser) => RwUser.fromPUser(prisma, pUser)),
    deck: async () => RwDeck.fromPDeck(
      prisma,
      await prisma.pRoom({ id: sRoom.id }).deck(),
    ),
    messages: async () => (
      await prisma.pRoom({ id: sRoom.id }).messages()
    ).map((pRoomMessage) => RwRoomMessage.fromPRoomMessage(prisma, pRoomMessage)),
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
};

// type assertions

const _SRoom: IModel<ISRoom> = SRoom;
const _RwRoom: IModel<IRwRoom> = RwRoom;
