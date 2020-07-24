import gql from "graphql-tag";
import { DECK_SCALARS } from "./DeckScalars";
import { USER_DECK_RECORD_SCALARS } from "./UserDeckRecordScalars";

export const DECK_DETAIL = gql`
${DECK_SCALARS}
${USER_DECK_RECORD_SCALARS}
fragment DeckDetail on Deck {
  ...DeckScalars
  subdecks {
    ...DeckScalars
  }
  ownRecord {
    ...UserDeckRecordScalars
  }
}
`;
