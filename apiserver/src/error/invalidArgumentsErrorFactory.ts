import { GraphQLError } from "graphql";

export function invalidArgumentsErrorFactory(message?: string): Error {
  return new GraphQLError(message ?? "Arguments passed are invalid", { extensions: { wrCode: "INVALID_ARGUMENTS" } });
}
