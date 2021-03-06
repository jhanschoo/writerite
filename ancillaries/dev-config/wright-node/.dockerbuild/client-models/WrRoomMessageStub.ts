import gql from "graphql-tag";

// tslint:disable-next-line: variable-name
export const WrRoomMessageStub = gql`
  fragment WrRoomMessageStub on RwRoomMessage {
    id
    content
    contentType
  }
`;

export enum WrRoomMessageContentType {
  TEXT = "TEXT",
  CONFIG = "CONFIG",
}

export interface IWrRoomMessageStub {
  readonly id: string;
  readonly content: string;
  readonly contentType: WrRoomMessageContentType;
}
