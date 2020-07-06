/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: WrChatMsgScalars
// ====================================================

export interface WrChatMsgScalars {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
}
