import { REDUCER_DEPTH } from "../util";
import type { ResTo } from "../types";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import type { WrBCard, WrDCard } from "../db-datasource/WrCard";
import { WrDeck, mapWrDDeckToWrDeck } from "./WrDeck";

export interface WrCardCreateOpts {
  deckId: string;
  prompt: string;
  fullAnswer: string;
  answers?: string[];
  sortKey?: string;
  template?: boolean;
}

export interface WrCardEditOpts {
  id: string;
  prompt?: string;
  fullAnswer?: string;
  answers?: string[];
  sortKey?: string;
  template?: string;
}

export interface WrCard {
  id: string;
  deckId: string;
  prompt: string;
  fullAnswer: string;
  answers: string[];
  sortKey: string;
  editedAt: string;
  template: boolean;

  deck: ResTo<WrDeck | null>;
}

export function mapWrBCardToWrDCard(bCard: WrBCard | null, wrDDS: WrDDataSource): Promise<WrDCard | null> {
  if (bCard === null) {
    return Promise.resolve(null);
  }
  return wrDDS.getWrCard(bCard.id);
}

export function mapWrDCardToWrCard(dCard: WrDCard, wrDDS: WrDDataSource): WrCard;
export function mapWrDCardToWrCard(dCard: WrDCard | null, wrDDS: WrDDataSource, depth?: number): WrCard | null;
export function mapWrDCardToWrCard(dCard: WrDCard | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): WrCard | null {
  if (depth === 0 || dCard === null) {
    return null;
  }
  return {
    ...dCard,
    deck: async (): Promise<WrDeck | null> => mapWrDDeckToWrDeck(await wrDDS.getWrDeck(dCard.deckId), wrDDS, depth - 1),
  };
}

export async function mapWrBCardToWrCard(bCard: WrBCard | null, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrCard | null> {
  if (depth === 0) {
    return Promise.resolve(null);
  }
  return mapWrDCardToWrCard(await mapWrBCardToWrDCard(bCard, wrDDS), wrDDS, depth);
}
