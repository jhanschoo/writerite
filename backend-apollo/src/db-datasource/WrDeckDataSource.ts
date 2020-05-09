import type { WrBDeck } from "./WrDeck";

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

export interface WrDeckDataSource<TDeck = WrBDeck, MaybeTDeck = TDeck | null, ArrayTDeck = TDeck[]> {
  getWrDeck(id: string): Promise<MaybeTDeck>;
  getWrDecksFromOwnerId(ownerId: string): Promise<ArrayTDeck>;
  getWrDecksFromParentId(ownerId: string): Promise<ArrayTDeck>;
  getWrDecksFromChildId(ownerId: string): Promise<ArrayTDeck>;
  createWrDeck(params: WrDeckCreateParams): Promise<MaybeTDeck>;
  createWrDeckFromRows(params: WrDeckCreateFromRowsParams): Promise<MaybeTDeck>;
  editWrDeck(params: WrDeckEditParams): Promise<MaybeTDeck>;
  deleteWrDeck(id: string): Promise<string>;
}
