import type { ResTo } from "../types";
import { REDUCER_DEPTH } from "../util";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import { WrBRoom, WrDRoom, isWrDRoom } from "../db-datasource/WrRoom";
import type { WrDUser } from "../db-datasource/WrUser";
import type { WrDChatMsg } from "../db-datasource/WrChatMsg";
import { WrRUser, mapWrBUserToWrRUser } from "./WrUser";
import { WrRChatMsg, mapWrBChatMsgToWrRChatMsg } from "./WrChatMsg";

export interface WrRRoom extends Required<WrBRoom> {
  owner: ResTo<WrRUser | undefined>;
  occupants: ResTo<(WrRUser | undefined)[]>;
  chatMsgs: ResTo<(WrRChatMsg | undefined)[]>;
}

export function mapWrBRoomToWrDRoom(dRoom: WrDRoom, wrDDS: WrDDataSource): Promise<WrDRoom>;
export function mapWrBRoomToWrDRoom(bRoom: WrBRoom | undefined, wrDDS: WrDDataSource): Promise<WrDRoom | undefined>;
export function mapWrBRoomToWrDRoom(bRoom: WrBRoom | undefined, wrDDS: WrDDataSource): Promise<WrDRoom | undefined> {
  if (bRoom === undefined) {
    return Promise.resolve(undefined);
  }
  if (isWrDRoom(bRoom)) {
    return Promise.resolve(bRoom);
  }
  return wrDDS.getWrRoom(bRoom.id);
}

export async function mapWrBRoomToWrRRoom(dRoom: WrDRoom, wrDDS: WrDDataSource): Promise<WrRRoom>;
export async function mapWrBRoomToWrRRoom(bRoom: WrBRoom | undefined, wrDDS: WrDDataSource, depth?: number): Promise<WrRRoom | undefined>;
export async function mapWrBRoomToWrRRoom(bRoom: WrBRoom | undefined, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrRRoom | undefined> {
  if (depth === 0) {
    return Promise.resolve(undefined);
  }
  const dRoom = await mapWrBRoomToWrDRoom(bRoom, wrDDS);
  if (dRoom === undefined) {
    return Promise.resolve(undefined);
  }
  return {
    ...dRoom,
    owner: async (): Promise<WrRUser | undefined> => mapWrBUserToWrRUser(await wrDDS.getWrUser(dRoom.ownerId), wrDDS, depth - 1),
    occupants: async (): Promise<(WrRUser | undefined)[]> => Promise.all((await wrDDS.getWrUsersFromOccupiedRoomId(dRoom.id)).map((dUser: WrDUser) => mapWrBUserToWrRUser(dUser, wrDDS, depth - 1))),
    chatMsgs: async (): Promise<(WrRChatMsg | undefined)[]> => Promise.all((await wrDDS.getWrChatMsgsFromRoomId(dRoom.id)).map((dChatMsg: WrDChatMsg) => mapWrBChatMsgToWrRChatMsg(dChatMsg, wrDDS, depth - 1))),
  };
}
