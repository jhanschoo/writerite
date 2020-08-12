import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WR_USER_STUB = gql`
fragment WrUserStub on RwUser {
  id
  email
  name
  roles
}
`;
