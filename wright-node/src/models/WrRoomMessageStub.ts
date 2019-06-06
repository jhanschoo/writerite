import gql from 'graphql-tag';

// tslint:disable-next-line: variable-name
export const WrRoomMessageStub = gql`
fragment WrRoomMessageStub on RwRoomMessage {
  id
  content
  contentType
}
`;

export enum WrMessageContentType {
  TEXT = 'TEXT',
}

export interface IWrRoomMessageStub {
  id: string;
  content: string;
  contentType: WrMessageContentType;
}
