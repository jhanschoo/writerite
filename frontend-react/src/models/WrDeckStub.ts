import { gql } from 'graphql.macro';

// tslint:disable-next-line: variable-name
export const WrDeckStub = gql`
fragment WrDeckStub on RwDeck {
  id
  name
  nameLang
  promptLang
  answerLang
}
`;

export interface IWrDeckStub {
  id: string;
  name: string;
  nameLang: string;
  promptLang: string;
  answerLang: string;
}