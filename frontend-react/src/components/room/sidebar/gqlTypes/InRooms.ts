/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InRooms
// ====================================================

export interface InRooms_rwInRooms_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface InRooms_rwInRooms {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: InRooms_rwInRooms_config;
}

export interface InRooms {
  readonly rwInRooms: ReadonlyArray<InRooms_rwInRooms> | null;
}
