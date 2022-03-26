export function userNotValidUserErrorFactory(message?: string): Error {
	return new Error(message ?? "Your user profile is not valid");
}
