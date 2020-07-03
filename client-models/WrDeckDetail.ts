import gql from 'graphql-tag';
import { WR_DECK } from './WrDeck';
import { WR_CARD } from './WrCard';

export const WR_DECK_DETAIL = gql`
${WR_DECK}
${WR_CARD}
fragment WrDeckDetail on Deck {
  ...WrDeck
  children {
    ...WrDeck
  }
  cards {
    ...WrCard
  }
}
`;
