import { Roles } from "./Roles";

export interface CurrentUser {
  id: string;
  name: string;
  roles: Roles[];
  occupyingActiveRoomSlugs: Record<string, string>;
}
