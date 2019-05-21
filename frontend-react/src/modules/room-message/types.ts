import { WrUser } from '../signin/types';

export enum ContentTypeEnum {
  TEXT,
}

export interface WrRoomMessage {
  readonly id: string;
  readonly sender: WrUser;
  readonly content: string;
  readonly contentType: ContentTypeEnum;
}
