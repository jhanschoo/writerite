import type { User } from "@prisma/client";
import type { Roles } from "../../types";
import { generateUserJWT } from "../crypto/jwtUtil";

export function userToJWT({
  user: { id, roles }, persist = false,
}: {
  user: User;
  persist?: boolean;
}): Promise<string> {
  return generateUserJWT({
    id,
    roles: roles as Roles[],
  }, persist);
}
