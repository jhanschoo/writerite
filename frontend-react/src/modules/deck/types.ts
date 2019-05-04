import { User, Payload } from '../../types';
import { WrCard } from '../card/types';

export interface WrDeck {
  readonly id: string;
  readonly name: string;
}

export interface WrDeckDetail extends WrDeck {
  readonly owner?: User;
  readonly cards: WrCard[];
}

export type WrDeckUpdatesPayload = Payload<WrDeck>;
