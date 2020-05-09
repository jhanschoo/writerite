import type { WrBRoom } from "./WrRoom";

export interface WrRoomCreateParams {
  ownerId: string;
  config: object;
}

export interface WrRoomEditParams {
  id: string;
  config: object;
}

export interface WrRoomDataSource<TRoom = WrBRoom, MaybeTRoom = TRoom | null, ArrayTRoom = TRoom[]> {
  getWrRoom(id: string): Promise<MaybeTRoom>;
  getWrRoomsFromOwnerId(ownerId: string): Promise<ArrayTRoom>;
  getWrRoomsFromOccupantId(occupantId: string): Promise<ArrayTRoom>;
  createWrRoom(params: WrRoomCreateParams): Promise<MaybeTRoom>;
  editWrRoom(params: WrRoomEditParams): Promise<MaybeTRoom>;
  deleteWrRoom(id: string): Promise<string>;
}
