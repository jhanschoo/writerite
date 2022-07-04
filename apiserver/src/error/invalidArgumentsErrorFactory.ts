export function invalidArgumentsErrorFactory(message?: string): Error {
  return new Error(message ?? "Arguments passed are invalid");
}
