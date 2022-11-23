/* eslint-disable @typescript-eslint/no-empty-interface */
import type * as p from '@prisma/client';

export interface Card extends p.Card {}

export interface Deck extends p.Deck {
  owner?: User;
  cards?: Card[];
}

export interface Message extends p.Message {}

export interface Occupant extends p.Occupant {
  room?: Room;
}

export interface Room extends p.Room {
  userIdOfLastAddedOccupantForSubscription?: string;
}

export interface Subdeck extends p.Subdeck {}

export interface User extends p.User {
  occupyingRooms?: Occupant[];
}

export interface UserCardRecord extends p.UserCardRecord {}

export interface UserDeckRecord extends p.UserDeckRecord {}
