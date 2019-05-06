import { Payload } from '../../types';

export interface WrCard {
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly promptLang: string;
  readonly answerLang: string;
  readonly sortKey: string;
  readonly editedAt: string;
  readonly template: boolean;
}

export type CardUpdatesPayload = Payload<WrCard>;
