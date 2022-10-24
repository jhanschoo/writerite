import { GraphQLError } from "graphql";

export function userNotValidUserErrorFactory(message?: string): Error {
  return new GraphQLError(message ?? "Your user profile is not valid", { extensions: { wrCode: "INVALID_USER_PROFILE" } });
}
