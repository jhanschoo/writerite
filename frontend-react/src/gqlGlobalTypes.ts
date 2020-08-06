/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ChatMsgContentType {
  CONFIG = "CONFIG",
  TEXT = "TEXT",
}

export enum DecksQueryScope {
  OWNED = "OWNED",
  PARTICIPATED = "PARTICIPATED",
  VISIBLE = "VISIBLE",
}

export interface CardCreateInput {
  readonly prompt: GraphQLJSONObject;
  readonly fullAnswer: GraphQLJSONObject;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey?: string | null;
  readonly template?: boolean | null;
}

export interface RoomConfigInput {
  readonly deckId?: string | null;
  readonly deckName?: string | null;
  readonly roundLength?: number | null;
  readonly clientDone?: boolean | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
