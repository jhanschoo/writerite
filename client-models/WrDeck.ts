import gql from "graphql-tag";
import { WR_DECK_SCALARS } from "./WrDeckScalars";
import { WR_USER_SCALARS } from "./WrUserScalars";
import { WR_CARD_SCALARS } from "./WrCardScalars";
import { WR_USER_DECK_RECORD_SCALARS } from "./WrUserDeckRecordScalars";

export const WR_DECK = gql`
${WR_DECK_SCALARS}
${WR_USER_SCALARS}
${WR_CARD_SCALARS}
${WR_USER_DECK_RECORD_SCALARS}
fragment WrDeck on Deck {
  ...WrDeckScalars
  owner {
    ...WrUserScalars
  }
  parents {
    ...WrDeckScalars
  }
  children {
    ...WrDeckScalars
  }
  cards {
    ...WrCardScalars
  }
  ownRecord {
    ...WrUserDeckRecordScalars
  }
}
`;
