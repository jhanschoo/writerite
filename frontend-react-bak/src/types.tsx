export interface User {
  readonly id: string;
  readonly email: string;
}

export enum MutationType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export interface Created<T> {
  readonly mutation: MutationType.CREATED;
  readonly new: T;
  readonly oldId: null;
}

export interface Updated<T> {
  readonly mutation: MutationType.UPDATED;
  readonly new: T;
  readonly oldId: null;
}

export interface Deleted {
  readonly mutation: MutationType.DELETED;
  readonly new: null;
  readonly oldId: string;
}

export type Payload<T> =
  | Created<T>
  | Updated<T>
  | Deleted
  ;
