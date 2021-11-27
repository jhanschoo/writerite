import { ForbiddenError } from "apollo-server-errors";

export function userLacksPermissionsErrorFactory(message?: string): ForbiddenError {
	return new ForbiddenError(message ?? "You are not allowed to perform this action");
}
