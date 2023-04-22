import { Roles } from "./Roles";

export interface CurrentUser {
  bareId: string;
  name: string;
  roles: Roles[];
  occupyingRoomSlugs: Record<string, string | null>;
}
