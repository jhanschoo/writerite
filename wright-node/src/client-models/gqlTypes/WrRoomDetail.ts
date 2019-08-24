/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: WrRoomDetail
// ====================================================

export interface WrRoomDetail_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoomDetail_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoomDetail_occupants {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoomDetail_messages_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoomDetail_messages_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoomDetail_messages_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: WrRoomDetail_messages_room_config;
}

export interface WrRoomDetail_messages {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: WrRoomDetail_messages_sender | null;
  readonly room: WrRoomDetail_messages_room | null;
}

export interface WrRoomDetail {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: WrRoomDetail_config;
  readonly owner: WrRoomDetail_owner;
  readonly occupants: ReadonlyArray<WrRoomDetail_occupants>;
  readonly messages: ReadonlyArray<WrRoomDetail_messages>;
}
