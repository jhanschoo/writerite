import { gql } from 'graphql.macro';
import { WrCardStub, IWrCardStub } from './WrCardStub';
import { WrDeckStub, IWrDeckStub } from './WrDeckStub';

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
