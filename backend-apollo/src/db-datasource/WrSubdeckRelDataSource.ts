import type { WrBSubdeckRel } from "./WrSubdeckRel";

export interface WrSubdeckRelKeyParams {
  parentId: string;
  childId: string;
}

export type WrSubdeckRelCreateParams = WrSubdeckRelKeyParams;

export interface WrSubdeckRelDataSource<TSubdeckRel = WrBSubdeckRel, MaybeTSubdeckRel = TSubdeckRel | null, ArrayTSubdeckRel = TSubdeckRel[]> {
  getWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<MaybeTSubdeckRel>;
  getWrSubdeckRelsFromParentId(parentId: string): Promise<ArrayTSubdeckRel>;
  getWrSubdeckRelsFromChildId(childId: string): Promise<ArrayTSubdeckRel>;
  createWrSubdeckRel(params: WrSubdeckRelCreateParams): Promise<MaybeTSubdeckRel>;
  deleteWrSubdeckRel(params: WrSubdeckRelKeyParams): Promise<WrSubdeckRelKeyParams>;
}
