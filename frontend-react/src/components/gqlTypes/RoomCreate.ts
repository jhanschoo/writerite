/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomCreate
// ====================================================

export interface RoomCreate_roomCreate {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
}

export interface RoomCreate {
  readonly roomCreate: RoomCreate_roomCreate | null;
}

export interface RoomCreateVariables {
  readonly config: GraphQLJSONObject;
}
