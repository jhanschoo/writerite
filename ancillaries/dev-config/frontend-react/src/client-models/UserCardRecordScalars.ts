import gql from "graphql-tag";

export const USER_CARD_RECORD_SCALARS = gql`
fragment UserCardRecordScalars on UserCardRecord {
  cardId
  userId
  correctRecord
}
`;
