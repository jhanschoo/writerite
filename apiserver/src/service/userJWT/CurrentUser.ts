import { Roles } from './Roles';

export interface CurrentUser {
  id: string;
  name: string | null;
  roles: Roles[];
  occupyingActiveRoomSlugs: Record<string, string>;
}
