/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: WrRoom
// ====================================================

export interface WrRoom_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoom_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoom_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface WrRoom_chatMsgs {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
}

export interface WrRoom {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: WrRoom_config;
  readonly owner: WrRoom_owner | null;
  readonly occupants: ReadonlyArray<(WrRoom_occupants | null)> | null;
  readonly chatMsgs: ReadonlyArray<(WrRoom_chatMsgs | null)> | null;
}
