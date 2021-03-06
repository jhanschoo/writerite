/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateType, RoomState } from "./../../gqlGlobalTypes";

// ====================================================
// GraphQL subscription operation: RoomsUpdatesSubscription
// ====================================================

export interface RoomsUpdatesSubscription_roomsUpdates_data {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly ownerConfig: GraphQLJSONObject;
  readonly internalConfig: GraphQLJSONObject;
  readonly state: RoomState;
}

export interface RoomsUpdatesSubscription_roomsUpdates {
  readonly __typename: "RoomUpdate";
  readonly type: UpdateType;
  readonly data: RoomsUpdatesSubscription_roomsUpdates_data | null;
}

export interface RoomsUpdatesSubscription {
  readonly roomsUpdates: RoomsUpdatesSubscription_roomsUpdates | null;
}
