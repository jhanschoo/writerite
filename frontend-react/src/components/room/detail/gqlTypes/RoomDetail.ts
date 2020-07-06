/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../../../gqlGlobalTypes";

// ====================================================
// GraphQL query operation: RoomDetail
// ====================================================

export interface RoomDetail_room_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomDetail_room_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_room_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_room_chatMsgs_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_room_chatMsgs_room_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomDetail_room_chatMsgs_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: RoomDetail_room_chatMsgs_room_config;
}

export interface RoomDetail_room_chatMsgs {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
  readonly sender: RoomDetail_room_chatMsgs_sender | null;
  readonly room: RoomDetail_room_chatMsgs_room | null;
}

export interface RoomDetail_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: RoomDetail_room_config;
  readonly owner: RoomDetail_room_owner | null;
  readonly occupants: ReadonlyArray<(RoomDetail_room_occupants | null)> | null;
  readonly chatMsgs: ReadonlyArray<(RoomDetail_room_chatMsgs | null)> | null;
}

export interface RoomDetail {
  readonly room: RoomDetail_room | null;
}

export interface RoomDetailVariables {
  readonly id: string;
}
