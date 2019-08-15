/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum RwMutationType {
  CREATED = "CREATED",
  DELETED = "DELETED",
  UPDATED = "UPDATED",
}

export enum RwRoomMessageContentType {
  CONFIG = "CONFIG",
  TEXT = "TEXT",
}

export interface IRoomConfigInput {
  readonly deckId?: string | null;
  readonly deckName?: string | null;
  readonly deckNameLang?: string | null;
  readonly roundLength?: number | null;
  readonly clientDone?: boolean | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
