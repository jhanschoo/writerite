import { REDUCER_DEPTH } from "../util";
import type { ResTo } from "../types";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import type { WrBRoom, WrDRoom } from "../db-datasource/WrRoom";
import type { WrDUser } from "../db-datasource/WrUser";
import type { WrDChatMsg } from "../db-datasource/WrChatMsg";
import { WrUser, mapWrDUserToWrUser } from "./WrUser";
import { WrChatMsg, mapWrDChatMsgToWrChatMsg } from "./WrChatMsg";

export interface WrRoomConfig {
  deckId?: string;
  deckName?: string;
  deckNameLang?: string;
  roundLength?: number;
  clientDone?: boolean;
}

export interface WrRoom {
  id: string;
  ownerId: string;
  archived: boolean;
  inactive: boolean;
  config: WrRoomConfig;

  owner: ResTo<WrUser | null>;
  occupants: ResTo<(WrUser | null)[]>;
  chatMsgs: ResTo<(WrChatMsg | null)[]>;
}

export function mapWrBRoomToWrDRoom(bRoom: WrBRoom | null, wrDDS: WrDDataSource): Promise<WrDRoom | null> {
  if (bRoom === null) {
    return Promise.resolve(null);
  }
  return wrDDS.getWrRoom(bRoom.id);
}

export function mapWrDRoomToWrRoom(dRoom: WrDRoom | null, wrDDS: WrDDataSource): WrRoom;
export function mapWrDRoomToWrRoom(dRoom: WrDRoom | null, wrDDS: WrDDataSource, depth?: number): WrRoom | null;
export function mapWrDRoomToWrRoom(dRoom: WrDRoom | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): WrRoom | null {
  if (depth === 0 || dRoom === null) {
    return null;
  }
  const config = JSON.parse(dRoom.config) as WrRoomConfig;
  const inactive = false; // TODO: properly compute value
  return {
    ...dRoom,
    config,
    inactive,
    owner: async (): Promise<WrUser | null> => mapWrDUserToWrUser(await wrDDS.getWrUser(dRoom.ownerId), wrDDS, depth - 1),
    occupants: async (): Promise<(WrUser | null)[]> => Promise.all((await wrDDS.getWrUsersFromOccupiedRoomId(dRoom.id)).map((dUser: WrDUser) => mapWrDUserToWrUser(dUser, wrDDS, depth - 1))),
    chatMsgs: async (): Promise<(WrChatMsg | null)[]> => Promise.all((await wrDDS.getWrChatMsgsFromRoomId(dRoom.id)).map((dChatMsg: WrDChatMsg) => mapWrDChatMsgToWrChatMsg(dChatMsg, wrDDS, depth - 1))),
  };
}

export async function mapWrBRoomToWrRRoom(bRoom: WrBRoom | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrRoom | null> {
  return mapWrDRoomToWrRoom(await mapWrBRoomToWrDRoom(bRoom, wrDDS), wrDDS, depth);
}
