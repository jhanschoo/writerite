import gql from "graphql-tag";

export const CARD_SCALARS = gql`
  fragment CardScalars on Card {
    id
    deckId
    prompt
    fullAnswer
    answers
    sortKey
    editedAt
    template
    mainTemplate
  }
`;
