import { Concrete, RecordOfKeys } from "../types";

export const WR_CHAT_MSG_COLS = [
  "id",
  "roomId",
  "senderId",
  "content",
  "contentType",
  "createdAt",
  "updatedAt",
] as const;

export enum WrChatMsgContentType {
  TEXT = "TEXT",
  CONFIG = "CONFIG",
}

export const WR_B_CHAT_MSG = "WrBChatMsg" as const;
export interface WrBChatMsg {
  id: string;
  roomId?: string;
  senderId?: string | null;
  content?: string;
  contentType?: WrChatMsgContentType;
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

export interface WrChatMsgCreateParams {
  roomId: string;
  senderId?: string;
  content: string;
  contentType: WrChatMsgContentType;
}

export interface WrChatMsgDataSource<TChatMsg extends WrBChatMsg=WrBChatMsg> {
  getWrChatMsg(id: string): Promise<TChatMsg | undefined>;
  getWrChatMsgsFromRoomId(roomId: string): Promise<TChatMsg[]>;
  createWrChatMsg(params: WrChatMsgCreateParams): Promise<TChatMsg | undefined>;
  deleteWrChatMsg(id: string): Promise<string>;
}
