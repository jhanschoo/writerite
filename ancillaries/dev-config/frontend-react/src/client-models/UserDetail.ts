import gql from "graphql-tag";
import { USER_SCALARS } from "./UserScalars";
import { DECK_SCALARS } from "./DeckScalars";

// TODO: add fields ownedRooms, occupyingRooms once pagination is implemented
export const USER_DETAIL = gql`
${USER_SCALARS}
${DECK_SCALARS}
fragment User on User {
  ...UserScalars
  decks {
    ...DeckScalars
  }
}
`;
