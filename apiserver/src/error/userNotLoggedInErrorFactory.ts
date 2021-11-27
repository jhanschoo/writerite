import { AuthenticationError } from "apollo-server-errors";

export function userNotLoggedInErrorFactory(message?: string): AuthenticationError {
	return new AuthenticationError(message ?? "You need to be logged in");
}
