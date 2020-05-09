import { REDUCER_DEPTH } from "../util";
import type { ResTo } from "../types";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import type { WrBDeck, WrDDeck } from "../db-datasource/WrDeck";
import type { WrDCard } from "../db-datasource/WrCard";
import { WrUser, mapWrDUserToWrUser } from "./WrUser";
import { WrCard, mapWrDCardToWrCard } from "./WrCard";

export interface WrDeckCreateOpts {
  name?: string;
  description?: string;
  nameLang?: string;
  promptLang?: string;
  answerLang?: string;
}

export interface WrDeckEditOpts {
  id: string;
  name?: string;
  description?: string;
  nameLang?: string;
  promptLang?: string;
  answerLang?: string;
}

export interface WrDeck {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  promptLang: string;
  answerLang: string;
  published: boolean;

  owner: ResTo<WrUser | null>;
  parents: ResTo<(WrDeck | null)[]>;
  children: ResTo<(WrDeck | null)[]>;
  cards: ResTo<(WrCard | null)[]>;
}

export function mapWrBDeckToWrDDeck(bDeck: WrBDeck | null, wrDDS: WrDDataSource): Promise<WrDDeck | null> {
  if (bDeck === null) {
    return Promise.resolve(null);
  }
  return wrDDS.getWrDeck(bDeck.id);
}

export function mapWrDDeckToWrDeck(dDeck: WrDDeck | null, wrDDS: WrDDataSource): WrDeck;
export function mapWrDDeckToWrDeck(dDeck: WrDDeck | null, wrDDS: WrDDataSource, depth?: number): WrDeck | null;
export function mapWrDDeckToWrDeck(dDeck: WrDDeck | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): WrDeck | null {
  if (depth === 0 || dDeck === null) {
    return null;
  }
  return {
    ...dDeck,
    owner: async (): Promise<WrUser | null> => mapWrDUserToWrUser(await wrDDS.getWrUser(dDeck.ownerId), wrDDS, depth - 1),
    parents: async (): Promise<(WrDeck | null)[]> => Promise.all((await wrDDS.getWrDecksFromChildId(dDeck.id)).map((ndDeck: WrDDeck) => mapWrDDeckToWrDeck(ndDeck, wrDDS, depth - 1))),
    children: async (): Promise<(WrDeck | null)[]> => Promise.all((await wrDDS.getWrDecksFromParentId(dDeck.id)).map((ndDeck: WrDDeck) => mapWrDDeckToWrDeck(ndDeck, wrDDS, depth - 1))),
    cards: async (): Promise<(WrCard | null)[]> => Promise.all((await wrDDS.getWrCardsFromDeckId(dDeck.id)).map((dCard: WrDCard) => mapWrDCardToWrCard(dCard, wrDDS, depth - 1))),
  };
}

export async function mapWrBDeckToWrRDeck(bDeck: WrBDeck | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrDeck | null> {
  return mapWrDDeckToWrDeck(await mapWrBDeckToWrDDeck(bDeck, wrDDS), wrDDS, depth);
}
