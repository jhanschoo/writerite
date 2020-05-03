import type { ResTo } from "../types";
import { REDUCER_DEPTH } from "../util";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import { WrBOccupancyRel, WrDOccupancyRel, WrOccupancyRelKeyParams, isWrDOccupancyRel } from "../db-datasource/WrOccupancyRel";
import { WrRUser, mapWrBUserToWrRUser } from "./WrUser";
import { WrRRoom, mapWrBRoomToWrRRoom } from "./WrRoom";

export interface WrROccupancyRel extends Required<WrBOccupancyRel> {
  room: ResTo<WrRRoom | undefined>;
  occupant: ResTo<WrRUser | undefined>;
}

export function mapWrBOccupancyRelToWrDOccupancyRel(dOccupancyRel: WrDOccupancyRel, wrDDS: WrDDataSource): Promise<WrDOccupancyRel>;
export function mapWrBOccupancyRelToWrDOccupancyRel(bOccupancyRel: WrBOccupancyRel | undefined, wrDDS: WrDDataSource): Promise<WrDOccupancyRel | undefined>;

/**
 * @param bOccupancyRel
 * @param wrDDS
 */
export function mapWrBOccupancyRelToWrDOccupancyRel(bOccupancyRel: WrBOccupancyRel | undefined, wrDDS: WrDDataSource): Promise<WrDOccupancyRel | undefined> {
  if (bOccupancyRel === undefined) {
    return Promise.resolve(undefined);
  }
  if (isWrDOccupancyRel(bOccupancyRel)) {
    return Promise.resolve(bOccupancyRel);
  }
  const { roomId, occupantId }: WrOccupancyRelKeyParams = bOccupancyRel;
  return wrDDS.getWrOccupancyRel({ roomId, occupantId });
}

export async function mapWrBOccupancyRelToWrROccupancyRel(dOccupancyRel: WrDOccupancyRel, wrDDS: WrDDataSource, depth?: number): Promise<WrROccupancyRel>;
export async function mapWrBOccupancyRelToWrROccupancyRel(bOccupancyRel: WrBOccupancyRel | undefined, wrDDS: WrDDataSource, depth?: number): Promise<WrROccupancyRel | undefined>;

/**
 * @param bOccupancyRel
 * @param wrDDS
 * @param depth
 */
export async function mapWrBOccupancyRelToWrROccupancyRel(bOccupancyRel: WrBOccupancyRel | undefined, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrROccupancyRel | undefined> {
  if (depth === 0) {
    return Promise.resolve(undefined);
  }
  const dOccupancyRel = await mapWrBOccupancyRelToWrDOccupancyRel(bOccupancyRel, wrDDS);
  if (dOccupancyRel === undefined) {
    return Promise.resolve(undefined);
  }
  return {
    ...dOccupancyRel,
    room: async (): Promise<WrRRoom | undefined> => mapWrBRoomToWrRRoom(await wrDDS.getWrRoom(dOccupancyRel.roomId), wrDDS, depth - 1),
    occupant: async (): Promise<WrRUser | undefined> => mapWrBUserToWrRUser(await wrDDS.getWrUser(dOccupancyRel.occupantId), wrDDS, depth - 1),
  };
}
