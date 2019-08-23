/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../../../../gqlGlobalTypes";

// ====================================================
// GraphQL query operation: RoomDetail
// ====================================================

export interface RoomDetail_rwRoom_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomDetail_rwRoom_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_rwRoom_occupants {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_rwRoom_messages_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_rwRoom_messages_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomDetail_rwRoom_messages_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomDetail_rwRoom_messages_room_config;
}

export interface RoomDetail_rwRoom_messages {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomDetail_rwRoom_messages_sender | null;
  readonly room: RoomDetail_rwRoom_messages_room | null;
}

export interface RoomDetail_rwRoom {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomDetail_rwRoom_config;
  readonly owner: RoomDetail_rwRoom_owner;
  readonly occupants: ReadonlyArray<RoomDetail_rwRoom_occupants>;
  readonly messages: ReadonlyArray<RoomDetail_rwRoom_messages>;
}

export interface RoomDetail {
  readonly rwRoom: RoomDetail_rwRoom | null;
}

export interface RoomDetailVariables {
  readonly id: string;
}
