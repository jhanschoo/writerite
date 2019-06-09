import { gql } from 'graphql.macro';
import { WrDeck, IWrDeck } from './WrDeck';
import { WrCard, IWrCard } from './WrCard';

export const WrDeckDetail = gql`
${WrDeck}
${WrCard}
fragment WrDeckDetail on RwDeck {
  ...WrDeck
  cards {
    ...WrCard
  }
}
`;

export interface IWrDeckDetail extends IWrDeck {
  cards: IWrCard[];
}
