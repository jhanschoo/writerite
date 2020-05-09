import { REDUCER_DEPTH } from "../util";
import type { ResTo } from "../types";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import type { WrBChatMsg, WrDChatMsg } from "../db-datasource/WrChatMsg";
import { WrUser, mapWrDUserToWrUser } from "./WrUser";
import { WrRoom, mapWrDRoomToWrRoom } from "./WrRoom";

export enum WrChatMsgContentType {
  TEXT = "TEXT",
  CONFIG = "CONFIG",
}

export interface WrChatMsgCreateOpts {
  roomId: string;
  content: string;
  contentType: keyof typeof WrChatMsgContentType;
}

export interface WrChatMsg {
  id: string;
  roomId: string;
  senderId: string | null;
  content: string;
  contentType: keyof typeof WrChatMsgContentType;

  sender: ResTo<WrUser | null>;
  room: ResTo<WrRoom | null>;
}

export function mapWrBChatMsgToWrDChatMsg(bChatMsg: WrBChatMsg | null, wrDDS: WrDDataSource): Promise<WrDChatMsg | null> {
  if (bChatMsg === null) {
    return Promise.resolve(null);
  }
  return wrDDS.getWrChatMsg(bChatMsg.id);
}

export function mapWrDChatMsgToWrChatMsg(dChatMsg: WrDChatMsg, wrDDS: WrDDataSource): WrChatMsg;
export function mapWrDChatMsgToWrChatMsg(dChatMsg: WrDChatMsg | null, wrDDS: WrDDataSource, depth?: number): WrChatMsg | null;
export function mapWrDChatMsgToWrChatMsg(dChatMsg: WrDChatMsg | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): WrChatMsg | null {
  if (depth === 0 || dChatMsg === null) {
    return null;
  }
  const { senderId } = dChatMsg;
  return {
    ...dChatMsg,
    sender: senderId === null
      ? null
      : async (): Promise<WrUser | null> => mapWrDUserToWrUser(await wrDDS.getWrUser(senderId), wrDDS, depth - 1),
    room: async (): Promise<WrRoom | null> => mapWrDRoomToWrRoom(await wrDDS.getWrRoom(dChatMsg.roomId), wrDDS, depth - 1),
  };
}

export async function mapWrBChatMsgToWrChatMsg(bChatMsg: WrBChatMsg | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrChatMsg | null> {
  return mapWrDChatMsgToWrChatMsg(await mapWrBChatMsgToWrDChatMsg(bChatMsg, wrDDS), wrDDS, depth);
}
