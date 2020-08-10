/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateType, ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL subscription operation: ChatMsgsOfRoomUpdatesSubscription
// ====================================================

export interface ChatMsgsOfRoomUpdatesSubscription_chatMsgsOfRoomUpdates_data_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface ChatMsgsOfRoomUpdatesSubscription_chatMsgsOfRoomUpdates_data {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
  readonly sender: ChatMsgsOfRoomUpdatesSubscription_chatMsgsOfRoomUpdates_data_sender | null;
}

export interface ChatMsgsOfRoomUpdatesSubscription_chatMsgsOfRoomUpdates {
  readonly __typename: "ChatMsgUpdate";
  readonly type: UpdateType;
  readonly data: ChatMsgsOfRoomUpdatesSubscription_chatMsgsOfRoomUpdates_data | null;
}

export interface ChatMsgsOfRoomUpdatesSubscription {
  readonly chatMsgsOfRoomUpdates: ChatMsgsOfRoomUpdatesSubscription_chatMsgsOfRoomUpdates | null;
}

export interface ChatMsgsOfRoomUpdatesSubscriptionVariables {
  readonly roomId: string;
}
