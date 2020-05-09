import type { WrBOccupancyRel } from "./WrOccupancyRel";

export interface WrOccupancyRelKeyParams {
  roomId: string;
  occupantId: string;
}

export type WrOccupancyRelCreateParams = WrOccupancyRelKeyParams;

export interface WrOccupancyRelDataSource<TOccupancyRel = WrBOccupancyRel, MaybeTOccupancyRel = TOccupancyRel | null, ArrayTOccupancyRel = TOccupancyRel[]> {
  getWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<MaybeTOccupancyRel>;
  getWrOccupancyRelsFromRoomId(roomId: string): Promise<ArrayTOccupancyRel>;
  getWrOccupancyRelsFromOccupantId(occupantId: string): Promise<ArrayTOccupancyRel>;
  createWrOccupancyRel(params: WrOccupancyRelCreateParams): Promise<MaybeTOccupancyRel>;
  deleteWrOccupancyRel(params: WrOccupancyRelKeyParams): Promise<WrOccupancyRelKeyParams>;
}
