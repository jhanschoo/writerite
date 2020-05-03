import type { ResTo } from "../types";
import { REDUCER_DEPTH } from "../util";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import { WrBUser, WrDUser, isWrDUser } from "../db-datasource/WrUser";
import type { WrDDeck } from "../db-datasource/WrDeck";
import type { WrDRoom } from "../db-datasource/WrRoom";
import { WrRDeck, mapWrBDeckToWrRDeck } from "./WrDeck";
import { WrRRoom, mapWrBRoomToWrRRoom } from "./WrRoom";

export interface WrRUser extends Required<WrBUser> {
  decks: ResTo<(WrRDeck | undefined)[]>;
  ownedRooms: ResTo<(WrRRoom | undefined)[]>;
  occupiedRooms: ResTo<(WrRRoom | undefined)[]>;
}

export function mapWrBUserToWrDUser(dUser: WrDUser, wrDDS: WrDDataSource): Promise<WrDUser>;
export function mapWrBUserToWrDUser(bUser: WrBUser | undefined, wrDDS: WrDDataSource): Promise<WrDUser | undefined>;
export function mapWrBUserToWrDUser(bUser: WrBUser | undefined, wrDDS: WrDDataSource): Promise<WrDUser | undefined> {
  if (bUser === undefined) {
    return Promise.resolve(undefined);
  }
  if (isWrDUser(bUser)) {
    return Promise.resolve(bUser);
  }
  return wrDDS.getWrUser(bUser.id);
}

export async function mapWrBUserToWrRUser(dUser: WrDUser, wrDDS: WrDDataSource): Promise<WrRUser>;
export async function mapWrBUserToWrRUser(bUser: WrBUser | undefined, wrDDS: WrDDataSource, depth?: number): Promise<WrRUser | undefined>;
export async function mapWrBUserToWrRUser(bUser: WrBUser | undefined, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrRUser | undefined> {
  if (depth === 0) {
    return Promise.resolve(undefined);
  }
  const dUser = await mapWrBUserToWrDUser(bUser, wrDDS);
  if (dUser === undefined) {
    return Promise.resolve(undefined);
  }
  return {
    ...dUser,
    decks: async (): Promise<(WrRDeck | undefined)[]> => Promise.all((await wrDDS.getWrDecksFromOwnerId(dUser.id)).map((dDeck: WrDDeck) => mapWrBDeckToWrRDeck(dDeck, wrDDS, depth - 1))),
    ownedRooms: async (): Promise<(WrRRoom | undefined)[]> => Promise.all((await wrDDS.getWrRoomsFromOwnerId(dUser.id)).map((dRoom: WrDRoom) => mapWrBRoomToWrRRoom(dRoom, wrDDS, depth - 1))),
    occupiedRooms: async (): Promise<(WrRRoom | undefined)[]> => Promise.all((await wrDDS.getWrRoomsFromOccupantId(dUser.id)).map((dRoom: WrDRoom) => mapWrBRoomToWrRRoom(dRoom, wrDDS, depth - 1))),
  };
}
