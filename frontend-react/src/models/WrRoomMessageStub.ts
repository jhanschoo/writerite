import { gql } from 'graphql.macro';

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
