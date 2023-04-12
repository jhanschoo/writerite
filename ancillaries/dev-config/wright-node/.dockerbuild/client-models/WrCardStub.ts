import gql from "graphql-tag";

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
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly answers: string[];
  readonly sortKey: string;
  readonly template: boolean;
  readonly editedAt: string;
}
