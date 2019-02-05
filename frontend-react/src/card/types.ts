import { Payload } from '../types';

export interface WrCard {
  readonly id: string;
  readonly front: string;
  readonly back: string;
}

export type CardUpdatesPayload = Payload<WrCard>;
