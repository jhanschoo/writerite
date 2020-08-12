import gql from "graphql-tag";
import { USER_SCALARS } from "../client-models";

export const USER_QUERY = gql`
${USER_SCALARS}
query UserQuery($id: ID!) {
  user(id: $id) {
    ...UserScalars
  }
}
`;
