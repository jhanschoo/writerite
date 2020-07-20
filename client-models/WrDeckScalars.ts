import gql from 'graphql-tag';

export const WR_DECK_SCALARS = gql`
fragment WrDeckScalars on Deck {
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
