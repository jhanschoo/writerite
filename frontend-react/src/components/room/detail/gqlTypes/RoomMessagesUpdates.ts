/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwMutationType, RwRoomMessageContentType } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL subscription operation: RoomMessagesUpdates
// ====================================================

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new_room_config;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new_sender | null;
  readonly room: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new_room | null;
}

export interface RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom {
  readonly __typename: "RwRoomMessageUpdate";
  readonly mutation: RwMutationType;
  readonly new: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom_new | null;
  readonly oldId: string | null;
}

export interface RoomMessagesUpdates {
  readonly rwRoomMessagesUpdatesOfRoom: RoomMessagesUpdates_rwRoomMessagesUpdatesOfRoom;
}

export interface RoomMessagesUpdatesVariables {
  readonly roomId: string;
}
