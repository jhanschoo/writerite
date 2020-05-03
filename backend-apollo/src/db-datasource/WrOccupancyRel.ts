import { Concrete, RecordOfKeys } from "../types";

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

export interface WrOccupancyRelKeyParams {
  roomId: string;
  occupantId: string;
}

export type WrOccupancyRelCreateParams = WrOccupancyRelKeyParams;

export interface WrOccupancyRelDataSource<TOccupancyRel extends WrBOccupancyRel=WrBOccupancyRel> {
  getWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<TOccupancyRel | undefined>;
  getWrOccupancyRelsFromRoomId(roomId: string): Promise<TOccupancyRel[]>;
  getWrOccupancyRelsFromOccupantId(occupantId: string): Promise<TOccupancyRel[]>;
  createWrOccupancyRel(params: WrOccupancyRelCreateParams): Promise<TOccupancyRel | undefined>;
  deleteWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<WrOccupancyRelKeyParams>;
}
