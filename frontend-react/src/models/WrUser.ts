import { gql } from 'graphql.macro';
import { WrUserStub, IWrUserStub } from './WrUserStub';
import { WrDeckStub, IWrDeckStub } from './WrDeckStub';

export const WrUser = gql`
fragment WrUser on RwUser {
  ...WrUserStub
  decks {
    ...WrDeckStub
  }
}
${WrUserStub}
${WrDeckStub}
`;

export interface IWrUser extends IWrUserStub {
  decks: IWrDeckStub[];
}
