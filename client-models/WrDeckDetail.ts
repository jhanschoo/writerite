import { gql } from 'graphql.macro';
import { WR_DECK } from './WrDeck';
import { WR_CARD } from './WrCard';

// tslint:disable-next-line: variable-name
export const WR_DECK_DETAIL = gql`
${WR_DECK}
${WR_CARD}
fragment WrDeckDetail on RwDeck {
  ...WrDeck
  cards {
    ...WrCard
  }
}
`;
