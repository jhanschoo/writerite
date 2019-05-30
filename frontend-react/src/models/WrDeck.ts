import { gql } from 'graphql.macro';
import { WrDeckStub, IWrDeckStub } from './WrDeckStub';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrCardStub, IWrCardStub } from './WrCardStub';

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
