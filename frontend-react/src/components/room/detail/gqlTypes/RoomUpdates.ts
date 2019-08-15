/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwMutationType, RwRoomMessageContentType } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL subscription operation: RoomUpdates
// ====================================================

export interface RoomUpdates_rwRoomUpdates_new_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdates_rwRoomUpdates_new_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_new_occupants {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_new_messages_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_new_messages_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdates_rwRoomUpdates_new_messages_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomUpdates_rwRoomUpdates_new_messages_room_config;
}

export interface RoomUpdates_rwRoomUpdates_new_messages {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomUpdates_rwRoomUpdates_new_messages_sender | null;
  readonly room: RoomUpdates_rwRoomUpdates_new_messages_room | null;
}

export interface RoomUpdates_rwRoomUpdates_new {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomUpdates_rwRoomUpdates_new_config;
  readonly owner: RoomUpdates_rwRoomUpdates_new_owner;
  readonly occupants: ReadonlyArray<RoomUpdates_rwRoomUpdates_new_occupants>;
  readonly messages: ReadonlyArray<RoomUpdates_rwRoomUpdates_new_messages>;
}

export interface RoomUpdates_rwRoomUpdates {
  readonly __typename: "RwRoomUpdate";
  readonly mutation: RwMutationType;
  readonly new: RoomUpdates_rwRoomUpdates_new | null;
  readonly oldId: string | null;
}

export interface RoomUpdates {
  readonly rwRoomUpdates: RoomUpdates_rwRoomUpdates;
}

export interface RoomUpdatesVariables {
  readonly id: string;
}
