/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../../../../gqlGlobalTypes";

// ====================================================
// GraphQL subscription operation: RoomMessagesUpdates
// ====================================================

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created_room_config;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created_sender | null;
  readonly room: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created_room | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated {
  readonly __typename: "RwRoomMessageCreated";
  readonly created: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated_created | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated_room_config;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated_sender | null;
  readonly room: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated_room | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated {
  readonly __typename: "RwRoomMessageUpdated";
  readonly updated: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated_updated | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageDeleted {
  readonly __typename: "RwRoomMessageDeleted";
  readonly deletedId: string | null;
}

export type RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom = RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageCreated | RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageUpdated | RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_RwRoomMessageDeleted;

export interface RoomMessagesUpdates {
  readonly rwRoomMessagesUpdatesOfRoom: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom;
}

export interface RoomMessagesUpdatesVariables {
  readonly roomId: string;
}
