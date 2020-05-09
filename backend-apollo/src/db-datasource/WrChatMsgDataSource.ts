import type { WrBChatMsg, WrBChatMsgContentType } from "./WrChatMsg";

export interface WrChatMsgCreateParams {
  roomId: string;
  senderId?: string;
  content: string;
  contentType: keyof typeof WrBChatMsgContentType;
}

export interface WrChatMsgDataSource<TChatMsg = WrBChatMsg, MaybeTChatMsg = TChatMsg | null, ArrayTChatMsg = TChatMsg[]> {
  getWrChatMsg(id: string): Promise<MaybeTChatMsg>;
  getWrChatMsgsFromRoomId(roomId: string): Promise<ArrayTChatMsg>;
  createWrChatMsg(params: WrChatMsgCreateParams): Promise<MaybeTChatMsg>;
  deleteWrChatMsg(id: string): Promise<string>;
}
