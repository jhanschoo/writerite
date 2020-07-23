import gql from "graphql-tag";

export const WR_USER_CARD_RECORD_SCALARS = gql`
fragment WrUserCardRecordScalars on UserCardRecord {
  cardId
  userId
  correctRecord
}
`;
