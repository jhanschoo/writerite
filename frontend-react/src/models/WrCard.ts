import { gql } from 'graphql.macro';
import { WrDeckStub, IWrDeckStub } from './WrDeck';

export const WrCardStub = gql`
fragment WrCardStub on RwCard {
  id
  prompt
  fullAnswer
  sortKey
  template
  editedAt
}
`;

export interface IWrCardStub {
  id: string;
  prompt: string;
  fullAnswer: string;
  sortKey: string;
  template: boolean;
  editedAt: string;
}

export const WrCard = gql`
fragment WrCard on RwCard {
  ...WrCardStub
  deck {
    ...WrDeckStub
  }
}
${WrCardStub}
${WrDeckStub}
`;

export interface IWrCard extends IWrCardStub {
  deck: IWrDeckStub[];
}
