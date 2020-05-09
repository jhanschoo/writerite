import { WrBUser } from "./WrUser";

export interface WrUserEditParams {
  id: string;
  name?: string;
}

export interface WrUserDataSource<TUser = WrBUser, MaybeTUser = TUser | null, ArrayTUser = TUser[]> {
  getWrUser(id: string): Promise<MaybeTUser>;
  getWrUsersFromName(name: string): Promise<ArrayTUser>;
  getWrUserFromEmail(email: string): Promise<MaybeTUser>;
  getWrUsersFromOccupiedRoomId(roomId: string): Promise<ArrayTUser>;
  editWrUser(params: WrUserEditParams): Promise<MaybeTUser>;
}
