/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL mutation operation: RoomMessageCreate
// ====================================================

export interface RoomMessageCreate_rwRoomMessageCreate_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomMessageCreate_rwRoomMessageCreate_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomMessageCreate_rwRoomMessageCreate_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomMessageCreate_rwRoomMessageCreate_room_config;
}

export interface RoomMessageCreate_rwRoomMessageCreate {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: RoomMessageCreate_rwRoomMessageCreate_sender | null;
  readonly room: RoomMessageCreate_rwRoomMessageCreate_room | null;
}

export interface RoomMessageCreate {
  readonly rwRoomMessageCreate: RoomMessageCreate_rwRoomMessageCreate | null;
}

export interface RoomMessageCreateVariables {
  readonly roomId: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
}
