import { gql } from 'graphql.macro';
import { WrDeckStub, IWrDeckStub } from './WrDeck';
import { IWrCardStub } from './WrCard';

export const WrUserStub = gql`
fragment WrUserStub on RwUser {
  id
  email
  roles
}
`;

export interface IWrUserStub {
  id: string;
  email: string;
  roles: string[];
}

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
