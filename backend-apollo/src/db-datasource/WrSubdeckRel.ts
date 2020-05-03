import { Concrete, RecordOfKeys } from "../types";

export const WR_SUBDECK_REL_COLS = [
  "parentId",
  "childId",
  "createdAt",
  "updatedAt",
] as const;

export const WR_B_SUBDECK_REL = "WrBSubdeckRel" as const;
export interface WrBSubdeckRel {
  parentId: string;
  childId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const WR_D_SUBDECK_REL = "WrDSubdeckRel" as const;
export type WrDSubdeckRel = Concrete<WrBSubdeckRel> & RecordOfKeys<typeof WR_SUBDECK_REL_COLS>;

/**
 * @param bSubdeckRel
 * @returns
 */
export function isWrDSubdeckRel(bSubdeckRel: WrBSubdeckRel): bSubdeckRel is WrDSubdeckRel {
  for (const key of WR_SUBDECK_REL_COLS) {
    if (bSubdeckRel[key] === undefined) {
      return false;
    }
  }
  return true;
}

export interface WrSubdeckRelKeyParams {
  parentId: string;
  childId: string;
}

export type WrSubdeckRelCreateParams = WrSubdeckRelKeyParams;

export interface WrSubdeckRelDataSource<TSubdeckRel extends WrBSubdeckRel=WrBSubdeckRel> {
  getWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<TSubdeckRel | undefined>;
  getWrSubdeckRelsFromParentId(parentId: string): Promise<TSubdeckRel[]>;
  getWrSubdeckRelsFromChildId(childId: string): Promise<TSubdeckRel[]>;
  createWrSubdeckRel(params: WrSubdeckRelCreateParams): Promise<TSubdeckRel | undefined>;
  deleteWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<WrSubdeckRelKeyParams>;
}
