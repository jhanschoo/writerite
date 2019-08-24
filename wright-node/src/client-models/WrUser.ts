import gql from 'graphql-tag';
import { WR_USER_STUB } from './WrUserStub';
import { WR_DECK_STUB } from './WrDeckStub';

// tslint:disable-next-line: variable-name
export const WR_USER = gql`
${WR_USER_STUB}
${WR_DECK_STUB}
fragment WrUser on RwUser {
  ...WrUserStub
  decks {
    ...WrDeckStub
  }
}
`;
