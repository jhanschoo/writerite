import { gql } from 'graphql.macro';

export const WrUserStub = gql`
fragment WrUserStub on RwUser {
  id
  email
  roles
}
`;

export interface IWrUserStub {
  id: string;
  email: string;
  roles: string[];
}