export interface User {
  readonly id: string;
  readonly email: string;
}

export interface Created<T> {
  readonly created: T;
}

export interface Updated<T> {
  readonly updated: T;
}

export interface Deleted<T> {
  readonly deletedId: string;
}

export type Payload<T> =
  | Created<T>
  | Updated<T>
  | Deleted<T>
  ;

export type FixRef<T extends { ref?: any }> = Omit<T, 'ref'> & { ref?: Exclude<T['ref'], string> };
