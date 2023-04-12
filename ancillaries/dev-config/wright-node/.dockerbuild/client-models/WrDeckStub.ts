import gql from "graphql-tag";

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
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly promptLang: string;
  readonly answerLang: string;
}
