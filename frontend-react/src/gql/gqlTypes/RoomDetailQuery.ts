/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState, ChatMsgContentType } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL query operation: RoomDetailQuery
// ====================================================

export interface RoomDetailQuery_room_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetailQuery_room_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomDetailQuery_room_chatMsgs {
  readonly __typename: "ChatMsg";
  readonly id: string;
  readonly roomId: string;
  readonly senderId: string | null;
  readonly type: ChatMsgContentType;
  readonly content: string;
}

export interface RoomDetailQuery_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
  readonly owner: RoomDetailQuery_room_owner | null;
  readonly occupants: ReadonlyArray<(RoomDetailQuery_room_occupants | null)> | null;
  readonly chatMsgs: ReadonlyArray<(RoomDetailQuery_room_chatMsgs | null)> | null;
}

export interface RoomDetailQuery {
  readonly room: RoomDetailQuery_room | null;
}

export interface RoomDetailQueryVariables {
  readonly id: string;
}
