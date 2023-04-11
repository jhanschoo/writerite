/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomEditOwnerConfigMutation
// ====================================================

export interface RoomEditOwnerConfigMutation_roomEditOwnerConfig {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
}

export interface RoomEditOwnerConfigMutation {
  readonly roomEditOwnerConfig: RoomEditOwnerConfigMutation_roomEditOwnerConfig | null;
}

export interface RoomEditOwnerConfigMutationVariables {
  readonly id: string;
  readonly ownerConfig: GraphQLJSONObject;
}
