/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateType, RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL subscription operation: RoomUpdatesSubscription
// ====================================================

export interface RoomUpdatesSubscription_roomUpdates_data_owner {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdatesSubscription_roomUpdates_data_occupants {
  readonly __typename: "User";
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: ReadonlyArray<string>;
}

export interface RoomUpdatesSubscription_roomUpdates_data {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
  readonly owner: RoomUpdatesSubscription_roomUpdates_data_owner | null;
  readonly occupants: ReadonlyArray<RoomUpdatesSubscription_roomUpdates_data_occupants | null> | null;
}

export interface RoomUpdatesSubscription_roomUpdates {
  readonly __typename: "RoomUpdate";
  readonly type: UpdateType;
  readonly data: RoomUpdatesSubscription_roomUpdates_data | null;
}

export interface RoomUpdatesSubscription {
  readonly roomUpdates: RoomUpdatesSubscription_roomUpdates | null;
}

export interface RoomUpdatesSubscriptionVariables {
  readonly id: string;
}
