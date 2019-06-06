import gql from 'graphql-tag';

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