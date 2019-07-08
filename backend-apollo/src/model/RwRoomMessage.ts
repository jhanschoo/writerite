import moment from 'moment';

import { PRoomMessage, Prisma, PRoomMessageContentType } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwUser, RwUser } from './RwUser';
import { IRwRoom, RwRoom } from './RwRoom';

export const enum RwRoomMessageContentType {
  TEXT = 'TEXT',
  CONFIG = 'CONFIG',
}

const rwRoomMessageContentTypeFromPRoomMessageContentType = (v: PRoomMessageContentType) => {
  switch (v) {
    case 'TEXT':
      return RwRoomMessageContentType.TEXT;
    case 'CONFIG':
      return RwRoomMessageContentType.CONFIG;
  }
};

export interface ISRoomMessage {
  id: string;
  content: string;
  contentType: RwRoomMessageContentType;
}

export interface IRwRoomMessage extends ISRoomMessage {
  sender: AFunResTo<IRwUser | null>;
  room: AFunResTo<IRwRoom>;
}

// TODO: implement persistence of contentType
export interface IRwRoomMessageCreate {
  roomId: string;
  senderId?: string;
  content: string;
  contentType: RwRoomMessageContentType;
}

// tslint:disable-next-line: variable-name
export const SRoomMessage = {
  fromPRoomMessage: (pRoomMessage: PRoomMessage): ISRoomMessage => ({
    ...pRoomMessage,
    contentType: rwRoomMessageContentTypeFromPRoomMessageContentType(pRoomMessage.contentType),
  }),
  get: async (prisma: Prisma, id: string): Promise<ISRoomMessage | null> => {
    const pRoomMessage = await prisma.pRoomMessage({ id });
    return pRoomMessage && SRoomMessage.fromPRoomMessage(pRoomMessage);
  },
  getFromRoomId: async (prisma: Prisma, roomId: string): Promise<ISRoomMessage[] | null> => {
    if (!await prisma.$exists.pRoom({ id: roomId })) {
      return null;
    }
    const pRoomMessages = await prisma.pRoomMessages({
      where: { room: { id: roomId } },
      orderBy: 'createdAt_ASC',
    });
    return pRoomMessages.map(SRoomMessage.fromPRoomMessage);
  },
  create: async (prisma: Prisma, { roomId, senderId, contentType, content }: IRwRoomMessageCreate) => {
    const pRoomMessage = await prisma.createPRoomMessage({
      room: { connect: { id: roomId } },
      content,
      contentType,
      sender: (senderId === undefined) ? undefined : { connect: { id: senderId } },
    });
    const pRoom = await prisma.pRoom({ id: roomId });
    // TODO: DRY-ify this together with other checks for inactivity in pooms
    if (pRoom && !pRoom.inactiveOverride && moment.utc(
      pRoom.lastKnownActiveMessage,
    ).isSameOrAfter(moment(pRoomMessage.createdAt).subtract(1, 'days'))) {
      await prisma.updatePRoom({
        data: { lastKnownActiveMessage: pRoomMessage.createdAt },
        where: { id: roomId },
      });
    }
    return SRoomMessage.fromPRoomMessage(pRoomMessage);
  },
};

// tslint:disable-next-line: variable-name
export const RwRoomMessage = {
  fromSRoomMessage: (prisma: Prisma, sRoomMessage: ISRoomMessage): IRwRoomMessage => ({
    ...sRoomMessage,
    sender: async () => {
      const pUsers = await prisma.pUsers({
        where: { sentMessages_some: { id: sRoomMessage.id } },
      });
      if (pUsers.length !== 1) {
        return null;
      }
      return RwUser.fromPUser(prisma, pUsers[0]);
    },
    room: async () => {
      const pRooms = await prisma.pRooms({
        where: { messages_some: { id: sRoomMessage.id } },
      });
      return RwRoom.fromPRoom(prisma, pRooms[0]);
    },
  }),
  fromPRoomMessage: (
    prisma: Prisma, pRoomMessage: PRoomMessage,
  ): IRwRoomMessage => RwRoomMessage.fromSRoomMessage(
    prisma, SRoomMessage.fromPRoomMessage(pRoomMessage),
  ),
  get: async (prisma: Prisma, id: string): Promise<IRwRoomMessage | null> => {
    const sRoomMessage = await SRoomMessage.get(prisma, id);
    return sRoomMessage && RwRoomMessage.fromSRoomMessage(prisma, sRoomMessage);
  },
  getFromRoomId: async (prisma: Prisma, userId: string): Promise<IRwRoomMessage[] | null> => {
    const sRoomMessages = await SRoomMessage.getFromRoomId(prisma, userId);
    return sRoomMessages && sRoomMessages.map(
      (sRoomMessage) => RwRoomMessage.fromSRoomMessage(prisma, sRoomMessage),
    );
  },
};

// type assertions

const _SRoomMessage: IModel<ISRoomMessage> = SRoomMessage;
const _RwRoomMessage: IModel<IRwRoomMessage> = RwRoomMessage;
