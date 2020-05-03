import type { ResTo } from "../types";
import { REDUCER_DEPTH } from "../util";
import { WrDDataSource } from "../db-datasource/WrDDataSource";
import { WrBSubdeckRel, WrDSubdeckRel, WrSubdeckRelKeyParams, isWrDSubdeckRel } from "../db-datasource/WrSubdeckRel";
import { WrRDeck, mapWrBDeckToWrRDeck } from "./WrDeck";

export interface WrRSubdeckRel extends Required<WrBSubdeckRel> {
  parent: ResTo<WrRDeck | undefined>;
  child: ResTo<WrRDeck | undefined>;
}

export function mapWrBSubdeckRelToWrDSubdeckRel(dSubdeckRel: WrDSubdeckRel, wrDDS: WrDDataSource): Promise<WrDSubdeckRel>;
export function mapWrBSubdeckRelToWrDSubdeckRel(bSubdeckRel: WrBSubdeckRel | undefined, wrDDS: WrDDataSource): Promise<WrDSubdeckRel | undefined>;
export function mapWrBSubdeckRelToWrDSubdeckRel(bSubdeckRel: WrBSubdeckRel | undefined, wrDDS: WrDDataSource): Promise<WrDSubdeckRel | undefined> {
  if (bSubdeckRel === undefined) {
    return Promise.resolve(undefined);
  }
  if (isWrDSubdeckRel(bSubdeckRel)) {
    return Promise.resolve(bSubdeckRel);
  }
  const { parentId, childId }: WrSubdeckRelKeyParams = bSubdeckRel;
  return wrDDS.getWrSubdeckRel({ parentId, childId });
}

export async function mapWrBSubdeckRelToWrRSubdeckRel(dSubdeckRel: WrDSubdeckRel, wrDDS: WrDDataSource): Promise<WrRSubdeckRel>;
export async function mapWrBSubdeckRelToWrRSubdeckRel(bSubdeckRel: WrBSubdeckRel | undefined, wrDDS: WrDDataSource, depth?: number): Promise<WrRSubdeckRel>;
export async function mapWrBSubdeckRelToWrRSubdeckRel(bSubdeckRel: WrBSubdeckRel | undefined, wrDDS: WrDDataSource, depth = REDUCER_DEPTH): Promise<WrRSubdeckRel | undefined> {
  if (depth === 0) {
    return Promise.resolve(undefined);
  }
  const dSubdeckRel = await mapWrBSubdeckRelToWrDSubdeckRel(bSubdeckRel, wrDDS);
  if (dSubdeckRel === undefined) {
    return Promise.resolve(undefined);
  }
  return {
    ...dSubdeckRel,
    parent: async (): Promise<WrRDeck | undefined> => mapWrBDeckToWrRDeck(await wrDDS.getWrDeck(dSubdeckRel.parentId), wrDDS, depth - 1),
    child: async (): Promise<WrRDeck | undefined> => mapWrBDeckToWrRDeck(await wrDDS.getWrDeck(dSubdeckRel.childId), wrDDS, depth - 1),
  };
}
