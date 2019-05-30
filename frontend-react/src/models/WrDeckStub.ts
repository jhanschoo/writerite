import { gql } from 'graphql.macro';

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