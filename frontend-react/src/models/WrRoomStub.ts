import { gql } from 'graphql.macro';

export const WrRoomStub = gql`
fragment WrRoomStub on RwRoom {
  id
}
`;

export interface IWrRoomStub {
  id: string;
}