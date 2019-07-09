import { gql } from 'graphql.macro';

// tslint:disable-next-line: variable-name
export const WrRoomMessageStub = gql`
fragment WrRoomMessageStub on RwRoomMessage {
  id
  content
  contentType
}
`;

export enum WrRoomMessageContentType {
  TEXT = 'TEXT',
  CONFIG = 'CONFIG',
}

export interface IWrRoomMessageStub {
  id: string;
  content: string;
  contentType: WrRoomMessageContentType;
}
