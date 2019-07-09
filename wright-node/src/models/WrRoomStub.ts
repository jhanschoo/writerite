import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WrRoomStub = gql`
fragment WrRoomStub on RwRoom {
  id
  config
}
`;

export interface IWrRoomStub {
  id: string;
  config: string;
}

// All fields in config should be optional for safety
export interface IRoomConfig {
  deckId?: string;
}
