import gql from "graphql-tag";
import { CARD_SCALARS } from "./CardScalars";
import { USER_CARD_RECORD_SCALARS } from "./UserCardRecordScalars";

export const CARD_DETAIL = gql`
${CARD_SCALARS}
${USER_CARD_RECORD_SCALARS}
fragment CardDetail on Card {
  ...CardScalars
  ownRecord {
    ...UserCardRecordScalars
  }
}
`;
