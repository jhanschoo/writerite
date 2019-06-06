import gql from 'graphql-tag';
import { WrDeck, IWrDeck } from './WrDeck';
import { WrCard, IWrCard } from './WrCard';

// tslint:disable-next-line: variable-name
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
