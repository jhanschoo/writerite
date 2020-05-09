import type { Concrete, RecordOfKeys } from "../types";

export const WR_OCCUPANCY_REL_COLS = [
  "roomId",
  "occupantId",
  "createdAt",
  "updatedAt",
] as const;

export const WR_B_OCCUPANCY_REL = "WrBOccupancyRel" as const;
export interface WrBOccupancyRel {
  roomId: string;
  occupantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_OCCUPANCY_REL = "WrDOccupancyRel" as const;
export type WrDOccupancyRel = Concrete<WrBOccupancyRel> & RecordOfKeys<typeof WR_OCCUPANCY_REL_COLS>;

/**
 * @param bOccupancyRel
 * @returns
 */
export function isWrDOccupancyRel(bOccupancyRel: WrBOccupancyRel): bOccupancyRel is WrDOccupancyRel {
  for (const key of WR_OCCUPANCY_REL_COLS) {
    if (bOccupancyRel[key] === undefined) {
      return false;
    }
  }
  return true;
}
