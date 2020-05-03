import type { ResTo } from "../types";
import { REDUCER_DEPTH } from "../util";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import { WrBCard, WrDCard, isWrDCard } from "../db-datasource/WrCard";
import { WrRDeck, mapWrBDeckToWrRDeck } from "./WrDeck";

export interface WrRCard extends Required<WrBCard> {
  deck: ResTo<WrRDeck | undefined>;
}

export function mapWrBCardToWrDCard(dCard: WrDCard, wrDDS: WrDDataSource): Promise<WrDCard>;
export function mapWrBCardToWrDCard(bCard: WrBCard | undefined, wrDDS: WrDDataSource): Promise<WrDCard | undefined>;

/**
 * @param dCard wrDCard
 * @param bCard
 * @param wrDDS
 * @returns
 */
export function mapWrBCardToWrDCard(bCard: WrBCard | undefined, wrDDS: WrDDataSource): Promise<WrDCard | undefined> {
  if (bCard === undefined) {
    return Promise.resolve(undefined);
  }
  if (isWrDCard(bCard)) {
    return Promise.resolve(bCard);
  }
  return wrDDS.getWrCard(bCard.id);
}

export async function mapWrBCardToWrRCard(dCard: WrDCard, wrDDS: WrDDataSource): Promise<WrRCard>;
export async function mapWrBCardToWrRCard(bCard: WrBCard | undefined, wrDDS: WrDDataSource, depth?: number): Promise<WrRCard | undefined>;

/**
 * @param bCard
 * @param wrDDS
 * @param depth
 * @returns
 */
export async function mapWrBCardToWrRCard(bCard: WrBCard | undefined, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrRCard | undefined> {
  if (depth === 0) {
    return Promise.resolve(undefined);
  }
  const dCard = await mapWrBCardToWrDCard(bCard, wrDDS);
  if (dCard === undefined) {
    return Promise.resolve(undefined);
  }
  return {
    ...dCard,
    deck: async (): Promise<WrRDeck | undefined> => mapWrBDeckToWrRDeck(await wrDDS.getWrDeck(dCard.deckId), wrDDS, depth - 1),
  };
}
