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
  readonly id: string;
  readonly email: string;
  readonly name?: string;
  readonly roles: string[];
}
