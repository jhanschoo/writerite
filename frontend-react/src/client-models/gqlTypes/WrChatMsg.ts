/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: WrChatMsg
// ====================================================

export interface WrChatMsg_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrChatMsg_room_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrChatMsg_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: WrChatMsg_room_config;
}

export interface WrChatMsg {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
  readonly sender: WrChatMsg_sender | null;
  readonly room: WrChatMsg_room | null;
}
