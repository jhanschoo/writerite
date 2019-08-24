/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: WrRoom
// ====================================================

export interface WrRoom_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoom_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoom_occupants {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoom_messages {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
}

export interface WrRoom {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: WrRoom_config;
  readonly owner: WrRoom_owner;
  readonly occupants: ReadonlyArray<WrRoom_occupants>;
  readonly messages: ReadonlyArray<WrRoom_messages>;
}
