import { Concrete, RecordOfKeys } from "../types";

export const WR_ROOM_COLS = [
  "id",
  "ownerId",
  "config",
  "createdAt",
  "updatedAt",
] as const;

export interface WrRoomConfig {
  readonly deckId?: string;
  readonly deckName?: string;
  readonly deckNameLang?: string;
  readonly roundLength?: number;
  readonly clientDone?: boolean;
}

export const WR_B_ROOM = "WrBRoom" as const;
export interface WrBRoom {
  id: string;
  ownerId?: string;
  config?: WrRoomConfig | string;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_ROOM = "WrDRoom" as const;
export interface WrDRoom extends Concrete<WrBRoom>, RecordOfKeys<typeof WR_ROOM_COLS>{
  id: string;
  ownerId: string;
  config: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @param bRoom
 * @returns
 */
export function isWrDRoom(bRoom: WrBRoom): bRoom is WrDRoom {
  for (const key of WR_ROOM_COLS) {
    if (bRoom[key] === undefined) {
      return false;
    }
  }
  return true;
}

export interface WrRoomCreateParams {
  ownerId: string;
  config: WrRoomConfig;
}

export interface WrRoomEditParams {
  id: string;
  config: WrRoomConfig;
}

export interface WrRoomDataSource<TRoom extends WrBRoom=WrBRoom> {
  getWrRoom(id: string): Promise<TRoom | undefined>;
  getWrRoomsFromOwnerId(ownerId: string): Promise<TRoom[]>;
  getWrRoomsFromOccupantId(occupantId: string): Promise<TRoom[]>;
  createWrRoom(params: WrRoomCreateParams): Promise<TRoom | undefined>;
  editWrRoom(params: WrRoomEditParams): Promise<TRoom | undefined>;
  deleteWrRoom(id: string): Promise<string>;
}
