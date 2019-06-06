import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WrRoomStub = gql`
fragment WrRoomStub on RwRoom {
  id
}
`;

export interface IWrRoomStub {
  id: string;
}
