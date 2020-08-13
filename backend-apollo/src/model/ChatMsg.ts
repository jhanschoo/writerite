import type { ChatMsg, PrismaClient } from "@prisma/client";
import type { UserSS } from "./User";
import type { RoomSS } from "./Room";

export enum ChatMsgContentType {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  TEXT = "TEXT",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CONFIG = "CONFIG",
}

// ChatMsgStoredScalars
export interface ChatMsgSS extends Partial<ChatMsg> {
  id: string;
  roomId: string;
  senderId: string | null;
  type: ChatMsgContentType;
  content: string;

  createdAt: Date;
  updatedAt: Date;

  sender?: UserSS | null;
  room?: RoomSS | null;
}

export async function userSeesChatMsg({ prisma, userId, chatMsgId }: {
  prisma: PrismaClient;
  userId?: string | null;
  chatMsgId?: string | null;
}): Promise<boolean> {
  if (!userId || !chatMsgId) {
    return false;
  }
  return await prisma.room.count({
    where: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      occupants: { some: { occupantId: userId } },
      chatMsgs: { some: { id: chatMsgId } },
    },
  }) === 1;
}

export function chatMsgToSS(chatMsg: ChatMsg): ChatMsgSS;
export function chatMsgToSS(chatMsg: ChatMsg | null): ChatMsgSS | null;
export function chatMsgToSS(chatMsg: ChatMsg | null): ChatMsgSS | null {
  if (chatMsg === null) {
    return null;
  }
  const { type } = chatMsg;
  return {
    ...chatMsg,
    type: type as ChatMsgContentType,
  };
}

export function chatMsgsOfRoomTopic(roomId: string): string {
  return `chatMsg<room#${roomId}>`;
}
