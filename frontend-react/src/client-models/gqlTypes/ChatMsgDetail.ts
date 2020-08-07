/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: ChatMsgDetail
// ====================================================

export interface ChatMsgDetail_sender {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface ChatMsgDetail_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly config: GraphQLJSONObject;
}

export interface ChatMsgDetail {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
  readonly sender: ChatMsgDetail_sender | null;
  readonly room: ChatMsgDetail_room | null;
}
