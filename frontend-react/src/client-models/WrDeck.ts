import gql from 'graphql-tag';
import { WR_DECK_SCALARS } from './WrDeckScalars';
import { WR_USER_SCALARS } from './WrUserScalars';
import { WR_CARD_SCALARS } from './WrCardScalars';

export const WR_DECK = gql`
${WR_DECK_SCALARS}
${WR_USER_SCALARS}
${WR_CARD_SCALARS}
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
}
`;
