import type { ResTo } from "../types";
import { REDUCER_DEPTH } from "../util";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import { WrBChatMsg, WrDChatMsg, isWrDChatMsg } from "../db-datasource/WrChatMsg";
import { WrRUser, mapWrBUserToWrRUser } from "./WrUser";
import { WrRRoom, mapWrBRoomToWrRRoom } from "./WrRoom";

export interface WrRChatMsg extends Required<WrBChatMsg> {
  sender: ResTo<WrRUser | null | undefined>;
  room: ResTo<WrRRoom | undefined>;
}

/**
 * @param bChatMsg
 * @param wrDDS
 * @returns
 */
export function mapWrBChatMsgToWrDChatMsg(dChatMsg: WrDChatMsg, wrDDS: WrDDataSource): Promise<WrDChatMsg>;
export function mapWrBChatMsgToWrDChatMsg(bChatMsg: WrBChatMsg | undefined, wrDDS: WrDDataSource): Promise<WrDChatMsg | undefined>;
export function mapWrBChatMsgToWrDChatMsg(bChatMsg: WrBChatMsg | undefined, wrDDS: WrDDataSource): Promise<WrDChatMsg | undefined> {
  if (bChatMsg === undefined) {
    return Promise.resolve(undefined);
  }
  if (isWrDChatMsg(bChatMsg)) {
    return Promise.resolve(bChatMsg);
  }
  return wrDDS.getWrChatMsg(bChatMsg.id);
}

/**
 * @param dChatMsg
 * @param wrDDS
 */
export async function mapWrBChatMsgToWrRChatMsg(dChatMsg: WrDChatMsg, wrDDS: WrDDataSource): Promise<WrRChatMsg>;
export async function mapWrBChatMsgToWrRChatMsg(bChatMsg: WrBChatMsg | undefined, wrDDS: WrDDataSource, depth?: number): Promise<WrRChatMsg | undefined>;
export async function mapWrBChatMsgToWrRChatMsg(bChatMsg: WrBChatMsg | undefined, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrRChatMsg | undefined> {
  if (depth === 0) {
    return Promise.resolve(undefined);
  }
  const dChatMsg = await mapWrBChatMsgToWrDChatMsg(bChatMsg, wrDDS);
  if (dChatMsg === undefined) {
    return Promise.resolve(undefined);
  }
  const { senderId } = dChatMsg;
  return {
    ...dChatMsg,
    sender: senderId === null
      ? null
      : async (): Promise<WrRUser | null | undefined> => mapWrBUserToWrRUser(await wrDDS.getWrUser(senderId), wrDDS, depth - 1),
    room: async (): Promise<WrRRoom | undefined> => mapWrBRoomToWrRRoom(await wrDDS.getWrRoom(dChatMsg.roomId), wrDDS, depth - 1),
  };
}
