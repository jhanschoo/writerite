/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RwRoomMessageContentType } from "./../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: MessageCreate
// ====================================================

export interface MessageCreate_rwRoomMessageCreate_sender {
  readonly __typename: "RwUser";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface MessageCreate_rwRoomMessageCreate_room_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface MessageCreate_rwRoomMessageCreate_room {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: MessageCreate_rwRoomMessageCreate_room_config;
}

export interface MessageCreate_rwRoomMessageCreate {
  readonly __typename: "RwRoomMessage";
  readonly id: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
  readonly sender: MessageCreate_rwRoomMessageCreate_sender | null;
  readonly room: MessageCreate_rwRoomMessageCreate_room | null;
}

export interface MessageCreate {
  readonly rwRoomMessageCreate: MessageCreate_rwRoomMessageCreate | null;
}

export interface MessageCreateVariables {
  readonly roomId: string;
  readonly content: string;
  readonly contentType: RwRoomMessageContentType;
}
