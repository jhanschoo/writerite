import { gql } from 'graphql.macro';
import { WrDeckStub, IWrDeckStub } from './WrDeckStub';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrCardStub, IWrCardStub } from './WrCardStub';

// tslint:disable-next-line: variable-name
export const WrDeck = gql`
${WrDeckStub}
${WrUserStub}
${WrCardStub}
fragment WrDeck on RwDeck {
  ...WrDeckStub
  owner {
    ...WrUserStub
  }
  cards {
    ...WrCardStub
  }
}
`;

export interface IWrDeck extends IWrDeckStub {
  readonly owner: IWrUserStub;
  readonly cards: IWrCardStub[];
}
