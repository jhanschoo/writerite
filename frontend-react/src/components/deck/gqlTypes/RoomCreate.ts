/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomConfigInput } from "./../../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomCreate
// ====================================================

export interface RoomCreate_roomCreate_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomCreate_roomCreate {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: RoomCreate_roomCreate_config;
}

export interface RoomCreate {
  readonly roomCreate: RoomCreate_roomCreate | null;
}

export interface RoomCreateVariables {
  readonly config: RoomConfigInput;
}
