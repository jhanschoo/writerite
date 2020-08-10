/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState, ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL fragment: RoomDetail
// ====================================================

export interface RoomDetail_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetail_chatMsgs {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
}

export interface RoomDetail {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
  readonly owner: RoomDetail_owner | null;
  readonly occupants: ReadonlyArray<(RoomDetail_occupants | null)> | null;
  readonly chatMsgs: ReadonlyArray<(RoomDetail_chatMsgs | null)> | null;
}
