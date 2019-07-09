import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WrCardStub = gql`
fragment WrCardStub on RwCard {
  id
  prompt
  fullAnswer
  answers
  sortKey
  template
  editedAt
}
`;

export interface IWrCardStub {
  id: string;
  prompt: string;
  fullAnswer: string;
  answers: string[];
  sortKey: string;
  template: boolean;
  editedAt: string;
}
