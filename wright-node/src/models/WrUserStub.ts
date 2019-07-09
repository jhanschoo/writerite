import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WrUserStub = gql`
fragment WrUserStub on RwUser {
  id
  email
  name
  roles
}
`;

export interface IWrUserStub {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}
