import gql from "graphql-tag";

export const DECK_SCALARS = gql`
fragment DeckScalars on Deck {
  id
  ownerId
  name
  description
  promptLang
  answerLang
  published
  usedAt
  editedAt
}
`;
