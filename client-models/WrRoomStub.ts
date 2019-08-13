import { gql } from 'graphql.macro';

// tslint:disable-next-line: variable-name
export const WrRoomStub = gql`
fragment WrRoomStub on RwRoom {
  id
  config {
    deckId
    deckName
    deckNameLang
    roundLength
    clientDone
  }
}
`;

export interface IWrRoomStub {
  readonly id: string;
  readonly config: IRoomConfig;
}

// All fields in config should be optional for safety
export interface IRoomConfig {
  readonly deckId?: string;
  readonly deckName?: string;
  readonly deckNameLang?: string;
  readonly roundLength?: number;
  readonly clientDone?: boolean;
}
