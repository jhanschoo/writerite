import { nanoid } from 'nanoid';

export function slug(size: number | null = 4): string {
  return nanoid(size ?? undefined);
}
