/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { IRoomConfigInput } from "./../../../../../gqlTypes/globalTypes";

// ====================================================
// GraphQL mutation operation: RoomUpdateConfig
// ====================================================

export interface RoomUpdateConfig_rwRoomUpdateConfig_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface RoomUpdateConfig_rwRoomUpdateConfig {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: RoomUpdateConfig_rwRoomUpdateConfig_config;
}

export interface RoomUpdateConfig {
  readonly rwRoomUpdateConfig: RoomUpdateConfig_rwRoomUpdateConfig | null;
}

export interface RoomUpdateConfigVariables {
  readonly id: string;
  readonly config: IRoomConfigInput;
}
