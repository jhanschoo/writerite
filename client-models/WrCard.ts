import { gql } from 'graphql.macro';
import { WR_CARD_STUB } from './WrCardStub';
import { WR_DECK_STUB } from './WrDeckStub';

// tslint:disable-next-line: variable-name
export const WR_CARD = gql`
${WR_CARD_STUB}
${WR_DECK_STUB}
fragment WrCard on RwCard {
  ...WrCardStub
  deck {
    ...WrDeckStub
  }
}
`;
