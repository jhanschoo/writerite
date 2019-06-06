import gql from 'graphql-tag';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrDeckStub, IWrDeckStub } from './WrDeckStub';

// tslint:disable-next-line: variable-name
export const WrUser = gql`
${WrUserStub}
${WrDeckStub}
fragment WrUser on RwUser {
  ...WrUserStub
  decks {
    ...WrDeckStub
  }
}
`;

export interface IWrUser extends IWrUserStub {
  decks: IWrDeckStub[];
}
