import type { Concrete, RecordOfKeys } from "../types";

export const WR_CHAT_MSG_COLS = [
  "id",
  "roomId",
  "senderId",
  "content",
  "contentType",
  "createdAt",
  "updatedAt",
] as const;

/*
 * migrate to enums once
 * https://github.com/microsoft/TypeScript/issues/17592
 * is resolved
 */
export enum WrBChatMsgContentType {
  TEXT = "TEXT",
  CONFIG = "CONFIG",
}

export const WR_B_CHAT_MSG = "WrBChatMsg" as const;
export interface WrBChatMsg {
  id: string;
  roomId?: string;
  senderId?: string | null;
  content?: string;
  contentType?: keyof typeof WrBChatMsgContentType;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_CHAT_MSG = "WrDChatMsg" as const;
export type WrDChatMsg = Concrete<WrBChatMsg> & RecordOfKeys<typeof WR_CHAT_MSG_COLS>;

/**
 * @param bChatMsg
 * @returns
 */
export function isWrDChatMsg(bChatMsg: WrBChatMsg): bChatMsg is WrDChatMsg {
  for (const key of WR_CHAT_MSG_COLS) {
    if (bChatMsg[key] === undefined) {
      return false;
    }
  }
  return true;
}
