/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateType, ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL subscription operation: ChatMsgsOfRoomUpdates
// ====================================================

export interface ChatMsgsOfRoomUpdates_chatMsgsOfRoomUpdates_data_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface ChatMsgsOfRoomUpdates_chatMsgsOfRoomUpdates_data {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
  readonly sender: ChatMsgsOfRoomUpdates_chatMsgsOfRoomUpdates_data_sender | null;
}

export interface ChatMsgsOfRoomUpdates_chatMsgsOfRoomUpdates {
  readonly __typename: "ChatMsgUpdate";
  readonly type: UpdateType;
  readonly data: ChatMsgsOfRoomUpdates_chatMsgsOfRoomUpdates_data | null;
}

export interface ChatMsgsOfRoomUpdates {
  readonly chatMsgsOfRoomUpdates: ChatMsgsOfRoomUpdates_chatMsgsOfRoomUpdates | null;
}

export interface ChatMsgsOfRoomUpdatesVariables {
  readonly roomId: string;
}
