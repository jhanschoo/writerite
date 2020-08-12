/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WrRoomStub
// ====================================================

export interface WrRoomStub_config {
  readonly __typename: "IRoomConfig";
  readonly deckId: string | null;
  readonly deckName: string | null;
  readonly deckNameLang: string | null;
  readonly roundLength: number | null;
  readonly clientDone: boolean | null;
}

export interface WrRoomStub {
  readonly __typename: "RwRoom";
  readonly id: string;
  readonly config: WrRoomStub_config;
}
