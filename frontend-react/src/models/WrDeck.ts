import { gql } from 'graphql.macro';
import { WrUserStub, IWrUserStub } from './WrUser';
import { WrCardStub, IWrCardStub } from './WrCard';

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

export const WrDeck = gql`
fragment WrDeck on RwDeck {
  ...WrDeckStub
  owner {
    ...WrUserStub
  }
  cards {
    ...WrCardStub
  }
}
${WrDeckStub}
${WrUserStub}
${WrCardStub}
`;

export interface IWrDeck extends IWrDeckStub {
  owner: IWrUserStub;
  cards: IWrCardStub[];
}
