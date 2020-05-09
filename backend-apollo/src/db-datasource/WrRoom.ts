import type { Concrete, RecordOfKeys } from "../types";

export const WR_ROOM_COLS = [
  "id",
  "ownerId",
  "archived",
  "config",
  "createdAt",
  "updatedAt",
] as const;

export const WR_B_ROOM = "WrBRoom" as const;
export interface WrBRoom {
  id: string;
  ownerId?: string;
  archived?: boolean;
  config?: string | object;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_ROOM = "WrDRoom" as const;
export interface WrDRoom extends Concrete<WrBRoom>, RecordOfKeys<typeof WR_ROOM_COLS> {
  id: string;
  // Constraint: all owners are occupants as well (i.e. represented in WrDOccupantRel)
  ownerId: string;
  archived: boolean;
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
