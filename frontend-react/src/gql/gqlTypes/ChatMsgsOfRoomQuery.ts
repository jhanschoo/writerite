/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL query operation: ChatMsgsOfRoomQuery
// ====================================================

export interface ChatMsgsOfRoomQuery_chatMsgsOfRoom_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface ChatMsgsOfRoomQuery_chatMsgsOfRoom {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: GraphQLJSON;
  readonly createdAt: GraphQLDateTime;
  readonly sender: ChatMsgsOfRoomQuery_chatMsgsOfRoom_sender | null;
}

export interface ChatMsgsOfRoomQuery {
  readonly chatMsgsOfRoom: ReadonlyArray<(ChatMsgsOfRoomQuery_chatMsgsOfRoom | null)> | null;
}

export interface ChatMsgsOfRoomQueryVariables {
  readonly roomId: string;
}
