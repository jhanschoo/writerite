import gql from "graphql-tag";
import { WR_CARD_SCALARS } from "./WrCardScalars";
import { WR_DECK_SCALARS } from "./WrDeckScalars";

export const WR_CARD = gql`
${WR_CARD_SCALARS}
${WR_DECK_SCALARS}
fragment WrCard on Card {
  ...WrCardScalars
  deck {
    ...WrDeckScalars
  }
}
`;
