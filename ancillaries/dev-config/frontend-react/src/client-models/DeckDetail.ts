import gql from "graphql-tag";
import { DECK_SCALARS } from "./DeckScalars";
import { CARD_DETAIL } from "./CardDetail";
import { USER_DECK_RECORD_SCALARS } from "./UserDeckRecordScalars";

export const DECK_DETAIL = gql`
  ${DECK_SCALARS}
  ${CARD_DETAIL}
  ${USER_DECK_RECORD_SCALARS}
  fragment DeckDetail on Deck {
    ...DeckScalars
    subdecks {
      ...DeckScalars
    }
    cards {
      ...CardDetail
    }
    ownRecord {
      ...UserDeckRecordScalars
    }
  }
`;
