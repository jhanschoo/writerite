import { WrUser } from '../signin/types';
import { WrDeck } from '../deck/types';
import { WrRoomMessage } from '../room-message/types';

export interface WrRoom {
  readonly id: string;
  readonly deck: WrDeck;
}

export interface WrRoomDetail extends WrRoom {
  readonly owner: WrUser;
  readonly occupants: WrUser[];
  readonly messages: WrRoomMessage[];
}
