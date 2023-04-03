import { GraphQLError } from "graphql";

export function userNotLoggedInErrorFactory(message?: string): Error {
  return new GraphQLError(message ?? "You need to be logged in", {
    extensions: { wrCode: "USER_NOT_LOGGED_IN" },
  });
}
