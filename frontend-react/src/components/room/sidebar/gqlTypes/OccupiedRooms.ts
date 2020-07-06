/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OccupiedRooms
// ====================================================

export interface OccupiedRooms_occupiedRooms_config {
  readonly __typename: "RoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface OccupiedRooms_occupiedRooms {
  readonly __typename: "Room";
  readonly id: string;
  readonly ownerId: string;
  readonly archived: boolean;
  readonly inactive: boolean;
  readonly config: OccupiedRooms_occupiedRooms_config;
}

export interface OccupiedRooms {
  readonly occupiedRooms: ReadonlyArray<(OccupiedRooms_occupiedRooms | null)> | null;
}
