import type { ResTo } from "../types";
import { REDUCER_DEPTH } from "../util";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import { WrBDeck, WrDDeck, isWrDDeck } from "../db-datasource/WrDeck";
import type { WrDCard } from "../db-datasource/WrCard";
import { WrRUser, mapWrBUserToWrRUser } from "./WrUser";
import { WrRCard, mapWrBCardToWrRCard } from "./WrCard";

export interface WrRDeck extends Required<WrBDeck> {
  owner: ResTo<WrRUser | undefined>;
  parents: ResTo<(WrRDeck | undefined)[]>;
  children: ResTo<(WrRDeck | undefined)[]>;
  cards: ResTo<(WrRCard | undefined)[]>;
}

export function mapWrBDeckToWrDDeck(dDeck: WrDDeck, wrDDS: WrDDataSource): Promise<WrDDeck>;
export function mapWrBDeckToWrDDeck(bDeck: WrBDeck | undefined, wrDDS: WrDDataSource): Promise<WrDDeck | undefined>;
export function mapWrBDeckToWrDDeck(bDeck: WrBDeck | undefined, wrDDS: WrDDataSource): Promise<WrDDeck | undefined> {
  if (bDeck === undefined) {
    return Promise.resolve(undefined);
  }
  if (isWrDDeck(bDeck)) {
    return Promise.resolve(bDeck);
  }
  return wrDDS.getWrDeck(bDeck.id);
}

export async function mapWrBDeckToWrRDeck(dDeck: WrDDeck, wrDDS: WrDDataSource): Promise<WrRDeck>;
export async function mapWrBDeckToWrRDeck(bDeck: WrBDeck | undefined, wrDDS: WrDDataSource, depth?: number): Promise<WrRDeck | undefined>;
export async function mapWrBDeckToWrRDeck(bDeck: WrBDeck | undefined, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrRDeck | undefined> {
  if (depth === 0) {
    return Promise.resolve(undefined);
  }
  const dDeck = await mapWrBDeckToWrDDeck(bDeck, wrDDS);
  if (dDeck === undefined) {
    return Promise.resolve(undefined);
  }
  return {
    ...dDeck,
    owner: async (): Promise<WrRUser | undefined> => mapWrBUserToWrRUser(await wrDDS.getWrUser(dDeck.ownerId), wrDDS, depth - 1),
    parents: async (): Promise<(WrRDeck | undefined)[]> => Promise.all((await wrDDS.getWrDecksFromChildId(dDeck.id)).map((ndDeck: WrDDeck) => mapWrBDeckToWrRDeck(ndDeck, wrDDS, depth - 1))),
    children: async (): Promise<(WrRDeck | undefined)[]> => Promise.all((await wrDDS.getWrDecksFromParentId(dDeck.id)).map((ndDeck: WrDDeck) => mapWrBDeckToWrRDeck(ndDeck, wrDDS, depth - 1))),
    cards: async (): Promise<(WrRCard | undefined)[]> => Promise.all((await wrDDS.getWrCardsFromDeckId(dDeck.id)).map((dCard: WrDCard) => mapWrBCardToWrRCard(dCard, wrDDS, depth - 1))),
  };
}
