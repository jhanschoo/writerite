/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL query operation: RoomQuery
// ====================================================

export interface RoomQuery_room {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
}

export interface RoomQuery {
  readonly room: RoomQuery_room | null;
}

export interface RoomQueryVariables {
  readonly id: string;
}
