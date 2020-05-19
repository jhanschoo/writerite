import { ChatMsg, PrismaClient } from "@prisma/client";
import { UserSS } from "./User";
import { RoomSS } from "./Room";

export enum ChatMsgContentType {
  TEXT = "TEXT",
  CONFIG = "CONFIG",
}

// ChatMsgStoredScalars
export interface ChatMsgSS extends Partial<ChatMsg> {
  id: string;
  roomId: string;
  senderId: string | null;
  type: ChatMsgContentType;
  content: string;

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
      occupants: { some: { B: userId } },
      chatMsgs: { some: { id: chatMsgId } },
    },
    first: 1,
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
  return `chatMsg:room::${roomId}`;
}
