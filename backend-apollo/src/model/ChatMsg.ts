import { ChatMsg } from "@prisma/client";

export interface ChatMsgTextContent {
  type: "text";
  text: string;
}

export interface ChatMsgControlContent {
  type: "control";
  // control is a JSON string
  control: string;
}

export type ChatMsgContent =
  | ChatMsgTextContent
  | ChatMsgControlContent;

// ChatMsgStoredScalars
export interface ChatMsgSS extends Partial<ChatMsg> {
  id: string;
  roomId: string;
  senderId: string | null;
  content: ChatMsgContent;
}

export function chatMsgToSS(chatMsg: ChatMsg): ChatMsgSS;
export function chatMsgToSS(chatMsg: ChatMsg | null): ChatMsgSS | null;
export function chatMsgToSS(chatMsg: ChatMsg | null): ChatMsgSS | null {
  if (chatMsg === null) {
    return null;
  }
  return {
    ...chatMsg,
    content: chatMsg.content as ChatMsgContent,
  };
}

export function chatMsgsOfRoomTopic(roomId: string): string {
  return `chatMsg:room::${roomId}`;
}
