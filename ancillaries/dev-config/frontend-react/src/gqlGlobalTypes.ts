/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ChatMsgContentType {
  CONFIG = "CONFIG",
  CONTEST_SCORE = "CONTEST_SCORE",
  ROUND_SCORE = "ROUND_SCORE",
  ROUND_START = "ROUND_START",
  ROUND_WIN = "ROUND_WIN",
  TEXT = "TEXT",
}

export enum DecksQueryScope {
  OWNED = "OWNED",
  PARTICIPATED = "PARTICIPATED",
  UNARCHIVED = "UNARCHIVED",
  VISIBLE = "VISIBLE",
}

export enum RoomState {
  SERVED = "SERVED",
  SERVING = "SERVING",
  WAITING = "WAITING",
}

export enum UpdateType {
  CREATED = "CREATED",
  DELETED = "DELETED",
  EDITED = "EDITED",
}

export interface CardCreateInput {
  readonly prompt: GraphQLJSONObject;
  readonly fullAnswer: GraphQLJSONObject;
  readonly answers: ReadonlyArray<string>;
  readonly sortKey?: string | null;
  readonly template?: boolean | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
