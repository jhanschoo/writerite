import { PRoomMessage, Prisma } from '../../generated/prisma-client';
import { AFunResTo, IModel } from '../types';
import { IRwUser, RwUser } from './RwUser';

export enum RwMessageContentType {
  TEXT = 'TEXT',
}

export interface ISRoomMessage {
  id: string;
  content: string;
  contentType: RwMessageContentType;
}

export interface IRwRoomMessage extends ISRoomMessage {
  id: string;
  content: string;
  contentType: RwMessageContentType;
  sender: AFunResTo<IRwUser | null>;
}

// TODO: implement persistence of contentType
export interface IRwRoomMessageCreate {
  roomId: string;
  senderId?: string;
  content: string;
}

// tslint:disable-next-line: variable-name
export const SRoomMessage = {
  fromPRoomMessage: (pRoomMessage: PRoomMessage) => ({
    ...pRoomMessage,
    contentType: RwMessageContentType.TEXT,
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
  create: async (prisma: Prisma, { roomId, senderId, content }: IRwRoomMessageCreate) => {
    return SRoomMessage.fromPRoomMessage(await prisma.createPRoomMessage({
      room: { connect: { id: roomId } },
      sender: senderId ? { connect: { id: senderId } } : undefined,
      content,
    }));
  },
};

// tslint:disable-next-line: variable-name
export const RwRoomMessage = {
  fromSRoomMessage: (prisma: Prisma, sRoomMessage: ISRoomMessage): IRwRoomMessage => ({
    ...sRoomMessage,
    sender: async () => RwUser.fromSUser(
      prisma,
      await prisma.pRoomMessage({ id: sRoomMessage.id }).sender(),
    ),
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
