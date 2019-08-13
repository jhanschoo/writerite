import gql from 'graphql-tag';
import { WrCardStub, IWrCardStub } from './WrCardStub';
import { WrDeckStub, IWrDeckStub } from './WrDeckStub';

// tslint:disable-next-line: variable-name
export const WrCard = gql`
${WrCardStub}
${WrDeckStub}
fragment WrCard on RwCard {
  ...WrCardStub
  deck {
    ...WrDeckStub
  }
}
`;

export interface IWrCard extends IWrCardStub {
  readonly deck: IWrDeckStub[];
}
