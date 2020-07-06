/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoomConfigInput } from "./../../../../gqlGlobalTypes";

// ====================================================
// GraphQL mutation operation: RoomUpdateConfig
// ====================================================

export interface RoomUpdateConfig_roomUpdateConfig_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdateConfig_roomUpdateConfig {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: RoomUpdateConfig_roomUpdateConfig_config;
}

export interface RoomUpdateConfig {
  readonly roomUpdateConfig: RoomUpdateConfig_roomUpdateConfig | null;
}

export interface RoomUpdateConfigVariables {
  readonly id: string;
  readonly config: RoomConfigInput;
}
