import { User, Payload } from '../types';
import { WrDeck } from '../deck/types';

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
  readonly servingDeck?: WrDeck;
}

// subscription types

export type WrRoomUpdatesPayload = Payload<WrRoom>;
