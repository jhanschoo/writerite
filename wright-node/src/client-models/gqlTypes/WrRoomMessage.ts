/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: WrRoomMessage
// ====================================================

export interface WrRoomMessage_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoomMessage_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoomMessage_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: WrRoomMessage_room_config;
}

export interface WrRoomMessage {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: WrRoomMessage_sender | null;
  readonly room: WrRoomMessage_room | null;
}
