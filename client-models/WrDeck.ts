import { gql } from 'graphql.macro';
import { WR_DECK_STUB } from './WrDeckStub';
import { WR_USER_STUB } from './WrUserStub';
import { WR_CARD_STUB } from './WrCardStub';

// tslint:disable-next-line: variable-name
export const WR_DECK = gql`
${WR_DECK_STUB}
${WR_USER_STUB}
${WR_CARD_STUB}
fragment WrDeck on RwDeck {
  ...WrDeckStub
  owner {
    ...WrUserStub
  }
  cards {
    ...WrCardStub
  }
}
`;
