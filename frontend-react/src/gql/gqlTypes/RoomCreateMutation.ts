/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomCreateMutation
// ====================================================

export interface RoomCreateMutation_roomCreate {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
}

export interface RoomCreateMutation {
  readonly roomCreate: RoomCreateMutation_roomCreate | null;
}

export interface RoomCreateMutationVariables {
  readonly ownerConfig?: GraphQLJSONObject | null;
}
