import { Concrete, RecordOfKeys } from "../types";

export const WR_DECK_COLS = [
  "id",
  "ownerId",
  "name",
  "description",
  "promptLang",
  "answerLang",
  "published",
  "createdAt",
  "updatedAt",
] as const;

export const WR_B_DECK = "WrBDeck" as const;
export interface WrBDeck {
  id: string;
  ownerId?: string;
  name?: string;
  description?: string;
  promptLang?: string;
  answerLang?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_DECK = "WrDDeck" as const;
export type WrDDeck = Concrete<WrBDeck> & RecordOfKeys<typeof WR_DECK_COLS>;

/**
 * @param bDeck
 * @returns
 */
export function isWrDDeck(bDeck: WrBDeck): bDeck is WrDDeck {
  for (const key of WR_DECK_COLS) {
    if (bDeck[key] === undefined) {
      return false;
    }
  }
  return true;
}

export interface WrDeckCreateParams {
  ownerId: string;
  name?: string;
  description?: string;
  promptLang?: string;
  answerLang?: string;
}

export interface WrDeckCreateFromRowsParams extends WrDeckCreateParams {
  rows: string[][];
}

export interface WrDeckEditParams {
  id: string;
  name?: string;
  description?: string;
  promptLang?: string;
  answerLang?: string;
}

export interface WrDeckDataSource<TDeck extends WrBDeck=WrBDeck> {
  getWrDeck(id: string): Promise<TDeck | undefined>;
  getWrDecksFromOwnerId(ownerId: string): Promise<TDeck[]>;
  getWrDecksFromParentId(ownerId: string): Promise<TDeck[]>;
  getWrDecksFromChildId(ownerId: string): Promise<TDeck[]>;
  createWrDeck(params: WrDeckCreateParams): Promise<TDeck | undefined>;
  createWrDeckFromRows(params: WrDeckCreateFromRowsParams): Promise<TDeck | undefined>;
  editWrDeck(params: WrDeckEditParams): Promise<TDeck | undefined>;
  deleteWrDeck(id: string): Promise<string>;
}
