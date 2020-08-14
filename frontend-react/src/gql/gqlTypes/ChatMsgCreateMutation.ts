/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: ChatMsgCreateMutation
// ====================================================

export interface ChatMsgCreateMutation_chatMsgCreate {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: GraphQLJSON;
}

export interface ChatMsgCreateMutation {
  readonly chatMsgCreate: ChatMsgCreateMutation_chatMsgCreate | null;
}

export interface ChatMsgCreateMutationVariables {
  readonly roomId: string;
  readonly type: ChatMsgContentType;
  readonly content: GraphQLJSON;
}
