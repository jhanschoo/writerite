import { User, Payload } from '../types';

export interface WrRoom {
  readonly id: string;
  readonly name: string;
  readonly owner: User;
}

export interface WrRoomDetail extends WrRoom {
  readonly id: string;
  readonly name: string;
  readonly owner: User;
  readonly occupants: User[];
}

export interface WrRoomMessages extends WrRoom {
  readonly id: string;
  readonly name: string;
  readonly messages: WrRoomMessage[];
}

export interface WrRoomMessage {
  readonly id: string;
  readonly content: string;
  readonly sender?: User;
}

// subscription types

export type WrRoomUpdatesPayload = Payload<WrRoom>;

export type WrRoomMessageUpdatesPayload = Payload<WrRoomMessage>;
