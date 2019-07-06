import { gql } from 'graphql.macro';

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
