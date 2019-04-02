import { User, Payload } from '../types';

export interface WrDeck {
  readonly id: string;
  readonly name: string;
  readonly owner: User;
}

export interface WrDeckDetail extends WrDeck {
  readonly id: string;
  readonly name: string;
  readonly owner: User;
}

export type WrDeckUpdatesPayload = Payload<WrDeck>;
