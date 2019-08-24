import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WR_DECK_STUB = gql`
fragment WrDeckStub on RwDeck {
  id
  name
  nameLang
  promptLang
  answerLang
}
`;
