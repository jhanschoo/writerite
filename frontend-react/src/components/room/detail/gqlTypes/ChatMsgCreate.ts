/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: ChatMsgCreate
// ====================================================

export interface ChatMsgCreate_chatMsgCreate_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface ChatMsgCreate_chatMsgCreate_room_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface ChatMsgCreate_chatMsgCreate_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: ChatMsgCreate_chatMsgCreate_room_config;
}

export interface ChatMsgCreate_chatMsgCreate {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
  readonly sender: ChatMsgCreate_chatMsgCreate_sender | null;
  readonly room: ChatMsgCreate_chatMsgCreate_room | null;
}

export interface ChatMsgCreate {
  readonly chatMsgCreate: ChatMsgCreate_chatMsgCreate | null;
}

export interface ChatMsgCreateVariables {
  readonly roomId: string;
  readonly type: ChatMsgContentType;
  readonly content: string;
}
