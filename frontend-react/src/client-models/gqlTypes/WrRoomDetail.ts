/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: WrRoomDetail
// ====================================================

export interface WrRoomDetail_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoomDetail_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoomDetail_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoomDetail_chatMsgs_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoomDetail_chatMsgs_room_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoomDetail_chatMsgs_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: WrRoomDetail_chatMsgs_room_config;
}

export interface WrRoomDetail_chatMsgs {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
  readonly sender: WrRoomDetail_chatMsgs_sender | null;
  readonly room: WrRoomDetail_chatMsgs_room | null;
}

export interface WrRoomDetail {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: WrRoomDetail_config;
  readonly owner: WrRoomDetail_owner | null;
  readonly occupants: ReadonlyArray<(WrRoomDetail_occupants | null)> | null;
  readonly chatMsgs: ReadonlyArray<(WrRoomDetail_chatMsgs | null)> | null;
}
