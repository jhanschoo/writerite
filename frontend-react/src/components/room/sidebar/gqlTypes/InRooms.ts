/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InRooms
// ====================================================

export interface InRooms_occupiedRooms_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface InRooms_occupiedRooms {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: InRooms_occupiedRooms_config;
}

export interface InRooms {
  readonly occupiedRooms: ReadonlyArray<(InRooms_occupiedRooms | null)> | null;
}
