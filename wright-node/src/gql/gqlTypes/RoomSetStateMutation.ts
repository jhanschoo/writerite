/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomSetStateMutation
// ====================================================

export interface RoomSetStateMutation_roomSetState {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
}

export interface RoomSetStateMutation {
  readonly roomSetState: RoomSetStateMutation_roomSetState | null;
}

export interface RoomSetStateMutationVariables {
  readonly id: string;
  readonly state: RoomState;
}
