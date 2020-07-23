import gql from "graphql-tag";

export const WR_USER_SCALARS = gql`
fragment WrUserScalars on User {
  id
  email
  name
  roles
}
`;
