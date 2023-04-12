/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomAddOccupantByEmailMutation
// ====================================================

export interface RoomAddOccupantByEmailMutation_roomAddOccupantByEmail_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomAddOccupantByEmailMutation_roomAddOccupantByEmail_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomAddOccupantByEmailMutation_roomAddOccupantByEmail {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
  readonly owner: RoomAddOccupantByEmailMutation_roomAddOccupantByEmail_owner | null;
  readonly occupants: ReadonlyArray<RoomAddOccupantByEmailMutation_roomAddOccupantByEmail_occupants | null> | null;
}

export interface RoomAddOccupantByEmailMutation {
  readonly roomAddOccupantByEmail: RoomAddOccupantByEmailMutation_roomAddOccupantByEmail | null;
}

export interface RoomAddOccupantByEmailMutationVariables {
  readonly id: string;
  readonly email: string;
}
