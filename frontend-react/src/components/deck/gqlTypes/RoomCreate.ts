/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomConfigInput, ChatMsgContentType } from "./../../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomCreate
// ====================================================

export interface RoomCreate_roomCreate_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomCreate_roomCreate_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomCreate_roomCreate_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomCreate_roomCreate_chatMsgs {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
}

export interface RoomCreate_roomCreate {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: RoomCreate_roomCreate_config;
  readonly owner: RoomCreate_roomCreate_owner | null;
  readonly occupants: ReadonlyArray<(RoomCreate_roomCreate_occupants | null)> | null;
  readonly chatMsgs: ReadonlyArray<(RoomCreate_roomCreate_chatMsgs | null)> | null;
}

export interface RoomCreate {
  readonly roomCreate: RoomCreate_roomCreate | null;
}

export interface RoomCreateVariables {
  readonly config: RoomConfigInput;
}
