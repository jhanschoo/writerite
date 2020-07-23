import gql from "graphql-tag";

export const WR_USER_DECK_RECORD_SCALARS = gql`
fragment WrUserDeckRecordScalars on UserDeckRecord {
  deckId
  userId
  notes
}
`;
