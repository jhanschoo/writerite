/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../../../../gqlGlobalTypes";

// ====================================================
// GraphQL subscription operation: RoomUpdates
// ====================================================

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created_occupants {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages_room_config;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages_sender | null;
  readonly room: RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages_room | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated_created {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomUpdates_rwRoomUpdates_RwRoomCreated_created_config;
  readonly owner: RoomUpdates_rwRoomUpdates_RwRoomCreated_created_owner;
  readonly occupants: ReadonlyArray<RoomUpdates_rwRoomUpdates_RwRoomCreated_created_occupants>;
  readonly messages: ReadonlyArray<RoomUpdates_rwRoomUpdates_RwRoomCreated_created_messages>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomCreated {
  readonly __typename: "RwRoomCreated";
  readonly created: RoomUpdates_rwRoomUpdates_RwRoomCreated_created | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_owner {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_occupants {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages_room_config;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages_sender | null;
  readonly room: RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages_room | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_config;
  readonly owner: RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_owner;
  readonly occupants: ReadonlyArray<RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_occupants>;
  readonly messages: ReadonlyArray<RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated_messages>;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomUpdated {
  readonly __typename: "RwRoomUpdated";
  readonly updated: RoomUpdates_rwRoomUpdates_RwRoomUpdated_updated | null;
}

export interface RoomUpdates_rwRoomUpdates_RwRoomDeleted {
  readonly __typename: "RwRoomDeleted";
  readonly deletedId: string | null;
}

export type RoomUpdates_rwRoomUpdates = RoomUpdates_rwRoomUpdates_RwRoomCreated | RoomUpdates_rwRoomUpdates_RwRoomUpdated | RoomUpdates_rwRoomUpdates_RwRoomDeleted;

export interface RoomUpdates {
  readonly rwRoomUpdates: RoomUpdates_rwRoomUpdates;
}

export interface RoomUpdatesVariables {
  readonly id: string;
}
