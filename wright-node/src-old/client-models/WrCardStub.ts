import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WR_CARD_STUB = gql`
fragment WrCardStub on RwCard {
  id
  prompt
  fullAnswer
  answers
  sortKey
  template
  editedAt
}
`;
