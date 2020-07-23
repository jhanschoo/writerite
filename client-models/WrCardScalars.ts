import gql from "graphql-tag";

export const WR_CARD_SCALARS = gql`
fragment WrCardScalars on Card {
  id
  deckId
  prompt
  fullAnswer
  answers
  sortKey
  editedAt
  template
}
`;
