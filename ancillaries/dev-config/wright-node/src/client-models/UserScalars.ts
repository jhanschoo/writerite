import gql from "graphql-tag";

export const USER_SCALARS = gql`
  fragment UserScalars on User {
    id
    email
    name
    roles
  }
`;
