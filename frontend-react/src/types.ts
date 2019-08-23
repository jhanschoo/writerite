export interface User {
  readonly id: string;
  readonly email: string;
}

export type FixRef<T extends { ref?: any }> = Omit<T, 'ref'> & { ref?: Exclude<T['ref'], string> };
