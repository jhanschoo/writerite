export function userLacksPermissionsErrorFactory(message?: string): Error {
  return new Error(message ?? "You are not allowed to perform this action");
}
