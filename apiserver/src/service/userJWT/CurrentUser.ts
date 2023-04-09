import { Roles } from "./Roles";

export interface CurrentUser {
  id: string;
  name: string;
  roles: Roles[];
  occupyingRoomSlugs: Record<string, string | null>;
}
