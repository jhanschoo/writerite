import { REDUCER_DEPTH } from "../util";
import type { ResTo } from "../types";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import type { WrBUser, WrDUser } from "../db-datasource/WrUser";
import type { WrDDeck } from "../db-datasource/WrDeck";
import type { WrDRoom } from "../db-datasource/WrRoom";
import { WrDeck, mapWrDDeckToWrDeck } from "./WrDeck";
import { WrRoom, mapWrDRoomToWrRoom } from "./WrRoom";

export interface WrUser {
  id: string;
  email: string;
  roles: string[];
  name: string | null;

  decks: ResTo<(WrDeck | null)[]>;
  ownedRooms: ResTo<(WrRoom | null)[]>;
  occupiedRooms: ResTo<(WrRoom | null)[]>;
}

export function mapWrBUserToWrDUser(bUser: WrBUser | null, wrDDS: WrDDataSource): Promise<WrDUser | null> {
  if (bUser === null) {
    return Promise.resolve(null);
  }
  return wrDDS.getWrUser(bUser.id);
}

export function mapWrDUserToWrUser(dUser: WrDUser | null, wrDDS: WrDDataSource): WrUser;
export function mapWrDUserToWrUser(dUser: WrDUser | null, wrDDS: WrDDataSource, depth?: number): WrUser | null;
export function mapWrDUserToWrUser(dUser: WrDUser | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): WrUser | null {
  if (depth === 0 || dUser === null) {
    return null;
  }
  return {
    ...dUser,
    decks: async (): Promise<(WrDeck | null)[]> => Promise.all((await wrDDS.getWrDecksFromOwnerId(dUser.id)).map((dDeck: WrDDeck) => mapWrDDeckToWrDeck(dDeck, wrDDS, depth - 1))),
    ownedRooms: async (): Promise<(WrRoom | null)[]> => Promise.all((await wrDDS.getWrRoomsFromOwnerId(dUser.id)).map((dRoom: WrDRoom) => mapWrDRoomToWrRoom(dRoom, wrDDS, depth - 1))),
    occupiedRooms: async (): Promise<(WrRoom | null)[]> => Promise.all((await wrDDS.getWrRoomsFromOccupantId(dUser.id)).map((dRoom: WrDRoom) => mapWrDRoomToWrRoom(dRoom, wrDDS, depth - 1))),
  };
}

export async function mapWrBUserToWrRUser(bUser: WrBUser | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrUser | null> {
  return mapWrDUserToWrUser(await mapWrBUserToWrDUser(bUser, wrDDS), wrDDS, depth);
}
