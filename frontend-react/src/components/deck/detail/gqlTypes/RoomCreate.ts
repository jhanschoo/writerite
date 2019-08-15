/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IRoomConfigInput, RwRoomMessageContentType } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL mutation operation: RoomCreate
// ====================================================

export interface RoomCreate_rwRoomCreate_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomCreate_rwRoomCreate_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomCreate_rwRoomCreate_occupants {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomCreate_rwRoomCreate_messages {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
}

export interface RoomCreate_rwRoomCreate {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomCreate_rwRoomCreate_config;
  readonly owner: RoomCreate_rwRoomCreate_owner;
  readonly occupants: ReadonlyArray<RoomCreate_rwRoomCreate_occupants>;
  readonly messages: ReadonlyArray<RoomCreate_rwRoomCreate_messages>;
}

export interface RoomCreate {
  readonly rwRoomCreate: RoomCreate_rwRoomCreate | null;
}

export interface RoomCreateVariables {
  readonly config: IRoomConfigInput;
}
