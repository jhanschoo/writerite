import { gql } from 'graphql.macro';

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
