export function userNotLoggedInErrorFactory(message?: string): Error {
  return new Error(message ?? "You need to be logged in");
}
