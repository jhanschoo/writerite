import gql from "graphql-tag";

export const USER_DECK_RECORD_SCALARS = gql`
  fragment UserDeckRecordScalars on UserDeckRecord {
    deckId
    userId
    notes
  }
`;
