import { Payload } from '../../types';

export interface WrCard {
  readonly id: string;
  readonly prompt: string;
  readonly fullAnswer: string;
  readonly sortKey: string;
}

export type CardUpdatesPayload = Payload<WrCard>;
