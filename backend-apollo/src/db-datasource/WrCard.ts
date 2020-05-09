import type { Concrete, RecordOfKeys } from "../types";

export const WR_CARD_COLS = [
  "id",
  "deckId",
  "prompt",
  "fullAnswer",
  "answers",
  "sortKey",
  "template",
  "editedAt",
  "createdAt",
  "updatedAt",
] as const;

export const WR_B_CARD = "WrBCard" as const;
export interface WrBCard {
  id: string;
  deckId?: string;
  prompt?: string;
  fullAnswer?: string;
  answers?: string[];
  sortKey?: string;
  editedAt?: string;
  template?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_CARD = "WrDCard" as const;
export type WrDCard = Concrete<WrBCard> & RecordOfKeys<typeof WR_CARD_COLS>;

/**
 * @param bCard
 * @returns
 */
export function isWrDCard(bCard: WrBCard): bCard is WrDCard {
  for (const key of WR_CARD_COLS) {
    if (bCard[key] === undefined) {
      return false;
    }
  }
  return true;
}
