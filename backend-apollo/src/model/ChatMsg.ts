import { ChatMsg } from "@prisma/client";

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
