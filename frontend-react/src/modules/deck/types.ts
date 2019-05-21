import { Payload } from '../../types';
import { WrCard } from '../card/types';
import { WrUser } from '../signin/types';

export interface WrDeck {
  readonly id: string;
  readonly name: string;
  readonly nameLang: string;
  readonly owner: WrUser;
}

export interface WrDeckDetail extends WrDeck {
  readonly promptLang: string;
  readonly answerLang: string;
  readonly cards: WrCard[];
}

export type WrDeckUpdatesPayload = Payload<WrDeck>;
