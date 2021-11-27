import type { User } from "@prisma/client";
import type { Roles } from "../../types";
import { generateJWT } from "../../util";

export function userToJWT({
	user: { id, email, roles, name }, persist = false,
}: {
	user: User;
	persist?: boolean;
}): string {
	return generateJWT({
		id,
		email,
		roles: roles as Roles[],
		name,
	}, persist);
}
