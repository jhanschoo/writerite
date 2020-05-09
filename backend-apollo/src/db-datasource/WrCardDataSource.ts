import type { WrBCard } from "./WrCard";

export interface WrCardCreateParams {
  deckId: string;
  prompt?: string;
  fullAnswer?: string;
  answers?: string[];
  sortKey?: string;
  template?: boolean;
}

export interface WrCardEditParams {
  id: string;
  prompt?: string;
  fullAnswer?: string;
  answers?: string[];
  sortKey?: string;
  template?: boolean;
}

export interface WrCardDataSource<TCard = WrBCard, MaybeTCard = TCard | null, ArrayTCard = TCard[]> {
  getWrCard(id: string): Promise<MaybeTCard>;
  getWrCardsFromDeckId(deckId: string): Promise<ArrayTCard>;
  createWrCard(params: WrCardCreateParams): Promise<MaybeTCard>;
  createWrCards(params: WrCardCreateParams[]): Promise<ArrayTCard>;
  editWrCard(params: WrCardEditParams): Promise<MaybeTCard>;
  deleteWrCard(id: string): Promise<string>;
}
