import gql from 'graphql-tag';
import { WR_USER_SCALARS } from './WrUserScalars';
import { WR_DECK_SCALARS } from './WrDeckScalars';

export const WR_USER = gql`
${WR_USER_SCALARS}
${WR_DECK_SCALARS}
fragment WrUser on User {
  ...WrUserScalars
  decks {
    ...WrDeckScalars
  }
}
`;
